import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy, buildSecurityHeaders, imageOriginsFromRemotePatterns } from "./security-headers";

const imageOrigins = ["https://www.kojinbango-card.go.jp", "https://www.moj.go.jp"];
const directives = (policy: string) => new Map(policy.split("; ").map((part) => {
  const [name, ...values] = part.split(" ");
  return [name, values] as const;
}));
const header = (headers: readonly { key: string; value: string }[], key: string) => headers.find((item) => item.key === key)?.value;

describe("security headers", () => {
  it("restricts every source while keeping the inline hydration scripts static pages need", () => {
    const policy = directives(buildContentSecurityPolicy({ imageOrigins, development: false }));
    expect(policy.get("default-src")).toEqual(["'self'"]);
    expect(policy.get("script-src")).toEqual(["'self'", "'unsafe-inline'"]);
    expect(policy.get("object-src")).toEqual(["'none'"]);
    expect(policy.get("frame-src")).toEqual(["'none'"]);
    expect(policy.get("frame-ancestors")).toEqual(["'none'"]);
    expect(policy.get("base-uri")).toEqual(["'self'"]);
    expect(policy.get("form-action")).toEqual(["'self'"]);
    expect(policy.get("img-src")).toEqual(["'self'", "data:", "blob:", ...imageOrigins]);
    expect(policy.get("connect-src")).toEqual(["'self'"]);
    expect(policy.has("upgrade-insecure-requests")).toBe(false);
  });

  it("allows the configured Supabase origin for browser sign-in and sync only", () => {
    const policy = directives(buildContentSecurityPolicy({ imageOrigins, supabaseOrigin: "https://project.supabase.co", development: false }));
    expect(policy.get("connect-src")).toEqual(["'self'", "https://project.supabase.co"]);
    expect(policy.get("script-src")).not.toContain("https://project.supabase.co");
  });

  it("adds transport policies only for an HTTPS public origin outside development", () => {
    const local = buildSecurityHeaders({ siteOrigin: "http://127.0.0.1:3000", imageOrigins, development: false });
    expect(header(local, "Strict-Transport-Security")).toBeUndefined();
    expect(header(local, "Content-Security-Policy")).not.toContain("upgrade-insecure-requests");

    const hosted = buildSecurityHeaders({ siteOrigin: "https://nihonest.example", imageOrigins, development: false });
    expect(header(hosted, "Strict-Transport-Security")).toBe("max-age=31536000");
    expect(header(hosted, "Content-Security-Policy")).toContain("upgrade-insecure-requests");

    const dev = buildSecurityHeaders({ siteOrigin: "https://nihonest.example", imageOrigins, development: true });
    expect(header(dev, "Strict-Transport-Security")).toBeUndefined();
    expect(header(dev, "Content-Security-Policy")).toContain("'unsafe-eval'");
    expect(directives(header(dev, "Content-Security-Policy")!).get("connect-src")).toContain("ws:");
  });

  it("sends the framing, sniffing, referrer, opener, and feature protections", () => {
    const headers = buildSecurityHeaders({ imageOrigins, development: false });
    expect(header(headers, "X-Content-Type-Options")).toBe("nosniff");
    expect(header(headers, "X-Frame-Options")).toBe("DENY");
    expect(header(headers, "Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(header(headers, "Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(header(headers, "Permissions-Policy")).toContain("microphone=()");
  });

  it("derives image origins from the remote image allowlist", () => {
    expect(imageOriginsFromRemotePatterns([
      { protocol: "https", hostname: "www.moj.go.jp" },
      { protocol: "https", hostname: "www.moj.go.jp" },
      { hostname: "images.example", port: "8443" },
    ])).toEqual(["https://www.moj.go.jp", "https://images.example:8443"]);
  });
});
