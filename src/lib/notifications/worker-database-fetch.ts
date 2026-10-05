import "server-only";
import { z } from "zod";

/** Bounds the request and response body for both PostgREST and the administrative Auth API. */
export function createWorkerDatabaseFetch(fetcher: typeof fetch, timeoutMs = 10_000, operationSignal?: AbortSignal): typeof fetch {
  z.number().int().min(1).max(30_000).parse(timeoutMs);
  return async (input, init) => {
    const controller = new AbortController();
    const originalSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
    const signal = AbortSignal.any([controller.signal, ...(originalSignal ? [originalSignal] : []), ...(operationSignal ? [operationSignal] : [])]);
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    try {
      const response = await fetcher(input, { ...init, signal, redirect: "error" });
      if (!response.body) return response;
      reader = response.body.getReader();
      const buffers: Uint8Array[] = [];
      let bytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        // Worker queries are bounded; oversized responses fail instead of growing process memory indefinitely.
        if (bytes > 2 * 1024 * 1024) throw new Error("The worker database response exceeds its limit.");
        buffers.push(value);
      }
      return new Response(Buffer.concat(buffers), {
        status: response.status, statusText: response.statusText, headers: response.headers,
      });
    } catch {
      controller.abort();
      // Do not propagate SDK/network errors that may contain URLs, query data, or credentials.
      throw new Error("The worker database request could not complete.");
    } finally {
      clearTimeout(timer);
      // Cancellation is best effort; awaiting a stalled cancel would defeat the request deadline.
      void reader?.cancel().catch(() => undefined);
    }
  };
}
