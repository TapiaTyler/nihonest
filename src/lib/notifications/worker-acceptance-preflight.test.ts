// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { ACCEPTANCE_EMPTY_TABLES, runAcceptancePreflight, type AcceptanceInventory } from "./worker-acceptance-preflight";

const sourceRef = "a".repeat(40);
const input = { sourceRef, currentRef: sourceRef, supabaseUrl: "http://127.0.0.1:55431", secretKey: "private-fixture-key" };
const empty: AcceptanceInventory = { authUsers: 0, tableRows: ACCEPTANCE_EMPTY_TABLES.map(() => 0), workerTime: "2026-10-03T00:00:00.000Z" };
afterEach(() => vi.restoreAllMocks());

describe("dedicated worker Auth/PostgREST preflight", () => {
  it.each([
    { sourceRef: "main" }, { sourceRef: "a".repeat(39) }, { currentRef: "b".repeat(40) },
    { supabaseUrl: "https://project.supabase.co" }, { supabaseUrl: "http://127.0.0.1.attacker.example:55431" },
    { supabaseUrl: "http://user:password@127.0.0.1:55431" },
    { supabaseUrl: "http://127.0.0.1:55431/private" }, { secretKey: undefined },
  ])("rejects unsafe/inexact configuration before any inventory access: %j", async (changes) => {
    const inventory = vi.fn().mockResolvedValue(empty);
    await expect(runAcceptancePreflight({ ...input, ...changes }, inventory)).rejects.toThrow();
    expect(inventory).not.toHaveBeenCalled();
  });

  it.each([
    { authUsers: 1 }, { tableRows: [0] }, { tableRows: ACCEPTANCE_EMPTY_TABLES.map(() => 1) },
    { tableRows: ACCEPTANCE_EMPTY_TABLES.map(() => -1) }, { workerTime: "1" },
  ])("rejects occupied/incomplete/invalid inventories: %j", async (changes) => {
    await expect(runAcceptancePreflight(input, async () => ({ ...empty, ...changes }))).rejects.toThrow();
  });

  it("uses real SDK read requests and the worker clock without generating, claiming, sending or writing", async () => {
    const requests: Array<{ method: string; pathname: string }> = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (resource, init) => {
      const url = new URL(String(resource));
      const method = init?.method ?? "GET";
      requests.push({ method, pathname: url.pathname });
      expect(url.origin).toBe(input.supabaseUrl);
      expect(init?.redirect).toBe("error");
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      if (url.pathname === "/auth/v1/admin/users") {
        expect(method).toBe("GET");
        expect(url.searchParams.get("per_page")).toBe("1");
        return new Response(JSON.stringify({ users: [] }), { headers: { "Content-Type": "application/json" } });
      }
      if (url.pathname === "/rest/v1/rpc/read_notification_worker_time") {
        expect(method).toBe("POST");
        return new Response(JSON.stringify(empty.workerTime), { headers: { "Content-Type": "application/json" } });
      }
      expect(method).toBe("HEAD");
      expect(ACCEPTANCE_EMPTY_TABLES).toContain(url.pathname.slice("/rest/v1/".length));
      return new Response(null, { headers: { "Content-Range": "*/0" } });
    });
    expect(await runAcceptancePreflight(input)).toEqual({
      status: "ready-for-fixtures", sourceRef, tablesChecked: ACCEPTANCE_EMPTY_TABLES.length, authUsers: 0, tableRows: 0,
    });
    expect(requests).toHaveLength(ACCEPTANCE_EMPTY_TABLES.length + 2);
  });

  it.each(["auth-denied", "missing-count"])("fails closed on %s without echoing SDK data", async (failure) => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (resource) => {
      const url = new URL(String(resource));
      if (url.pathname.endsWith("read_notification_worker_time")) return new Response(JSON.stringify(empty.workerTime));
      if (url.pathname === "/auth/v1/admin/users") {
        return failure === "auth-denied"
          ? new Response(JSON.stringify({ message: "private-network-canary" }), { status: 403 })
          : new Response(JSON.stringify({ users: [] }));
      }
      return new Response(null, { headers: failure === "missing-count" ? {} : { "Content-Range": "*/0" } });
    });
    await expect(runAcceptancePreflight(input)).rejects.toThrow(failure === "auth-denied"
      ? "Acceptance Auth inventory is unavailable." : "Acceptance inventory is unavailable.");
  });
});
