// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const supabase = vi.hoisted(() => ({ configured: true, exchangeError: null as null | { message: string } }));

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: () => supabase.configured,
  getSupabasePublicConfig: () => ({ url: "http://127.0.0.1:54321", publishableKey: "fixture-publishable-key" }),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, options: { cookies: { setAll(cookies: { name: string; value: string; options: object }[]): void } }) => ({
    auth: {
      async exchangeCodeForSession() {
        if (!supabase.exchangeError) {
          options.cookies.setAll([{ name: "sb-127-auth-token", value: "fixture-session", options: { path: "/", httpOnly: false, sameSite: "lax" } }]);
        }
        return { error: supabase.exchangeError };
      },
      async verifyOtp() {
        return { error: null };
      },
    },
  }),
}));

const { GET } = await import("./route");

const callback = (query: string) => GET(new NextRequest(`http://127.0.0.1:3000/auth/callback?${query}`));

beforeEach(() => {
  supabase.configured = true;
  supabase.exchangeError = null;
});

describe("authentication callback", () => {
  it("redirects relative to the current host and keeps the exchanged session cookies", async () => {
    const response = await callback("code=fixture&next=/account");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("/account?auth=success");
    expect(response.cookies.get("sb-127-auth-token")?.value).toBe("fixture-session");
  });

  it("preserves an ordinary path, query, and fragment", async () => {
    const response = await callback(`code=fixture&next=${encodeURIComponent("/articles/artist-status?journey=j#local-guidance-heading")}`);
    expect(response.headers.get("location")).toBe("/articles/artist-status?journey=j&auth=success#local-guidance-heading");
  });

  it.each([
    "/account/..//attacker.example",
    "/account/%2e%2e//attacker.example",
    "//attacker.example",
    "/\\attacker.example",
    "https://attacker.example",
  ])("never emits an off-site Location for next=%j", async (next) => {
    for (const query of [`code=fixture&next=${encodeURIComponent(next)}`, `next=${encodeURIComponent(next)}`]) {
      const location = (await callback(query)).headers.get("location")!;
      expect(location.startsWith("/") && !location.startsWith("//") && !location.startsWith("/\\"), location).toBe(true);
      expect(location).not.toContain("attacker.example");
    }
  });

  it("reports unavailable accounts and failed exchanges without session cookies", async () => {
    supabase.configured = false;
    expect((await callback("code=fixture&next=/account/..//attacker.example")).headers.get("location")).toBe("/account?auth=unavailable");
    supabase.configured = true;
    supabase.exchangeError = { message: "invalid" };
    const failed = await callback("code=fixture&next=/account");
    expect(failed.headers.get("location")).toBe("/account?auth=error");
    expect(failed.cookies.get("sb-127-auth-token")).toBeUndefined();
  });

  it("rejects a callback without a code or a supported token type", async () => {
    expect((await callback("next=/account")).headers.get("location")).toBe("/account?auth=error");
  });
});
