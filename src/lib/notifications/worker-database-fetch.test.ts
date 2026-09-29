// @vitest-environment node
import { createServer } from "node:http";
import { once } from "node:events";
import { describe, expect, it, vi } from "vitest";
import { createWorkerDatabaseFetch } from "./worker-database-fetch";

describe("worker database request bounds", () => {
  it("aborts a stalled native response body after headers have arrived", async () => {
    const server = createServer((_request, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write("{"); // Deliberately never finishes the body.
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Missing fixture port");
    let headersReceived = false;
    try {
      const nativeFetch: typeof fetch = async (input, init) => {
        const response = await fetch(input, init);
        headersReceived = true;
        return response;
      };
      await expect(createWorkerDatabaseFetch(nativeFetch, 500)(`http://127.0.0.1:${address.port}`)).rejects.toThrow("The worker database request could not complete.");
      expect(headersReceived).toBe(true);
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it("preserves an existing cancellation signal and rejects redirects", async () => {
    const controller = new AbortController();
    controller.abort();
    const fetcher = vi.fn<typeof fetch>(async (_input, init) => {
      expect(init?.signal?.aborted).toBe(true);
      expect(init?.redirect).toBe("error");
      throw new Error("Private transport error");
    });
    await expect(createWorkerDatabaseFetch(fetcher)("https://example.test", { signal: controller.signal })).rejects.toThrow("The worker database request could not complete.");
  });

  it("rejects oversized bodies and invalid request budgets", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => new Response("x".repeat(2 * 1024 * 1024 + 1)));
    await expect(createWorkerDatabaseFetch(fetcher)("https://example.test")).rejects.toThrow("The worker database request could not complete.");
    expect(() => createWorkerDatabaseFetch(fetcher, 0)).toThrow();
    expect(() => createWorkerDatabaseFetch(fetcher, 30_001)).toThrow();
  });
});
