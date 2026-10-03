// @vitest-environment node
import { describe, expect, it } from "vitest";
import { GET, HEAD } from "./route";

describe("health route", () => {
  it("reports process liveness without caching or configuration details", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("answers HEAD probes without a body", async () => {
    const response = HEAD();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.text()).toBe("");
  });
});
