/**
 * Response security headers, built from what the site actually loads. Pages are prebuilt, so the Content Security
 * Policy cannot use per-request nonces (the installed Next.js CSP guide: nonces require dynamic rendering). Inline
 * scripts therefore stay allowed for Next's hydration payload; the policy still restricts every other source.
 * Transport headers (HSTS, upgrade-insecure-requests) are sent only when the public origin is HTTPS.
 */
export type SecurityHeaderOptions = Readonly<{
  /** Normalized public site origin, when configured. */
  siteOrigin?: string;
  /** Normalized Supabase origin, when accounts are configured; the browser calls it for sign-in and sync. */
  supabaseOrigin?: string;
  /** Origins of images the browser loads directly (unoptimized official document images). */
  imageOrigins: readonly string[];
  /** `next dev` needs eval for React debugging and a websocket for hot reload. */
  development: boolean;
}>;

export type SecurityHeader = Readonly<{ key: string; value: string }>;

export function buildContentSecurityPolicy(options: SecurityHeaderOptions): string {
  const https = Boolean(options.siteOrigin?.startsWith("https://"));
  const connect = ["'self'", ...(options.supabaseOrigin ? [options.supabaseOrigin] : []), ...(options.development ? ["ws:"] : [])];
  const directives: [string, ...string[]][] = [
    ["default-src", "'self'"],
    ["script-src", "'self'", "'unsafe-inline'", ...(options.development ? ["'unsafe-eval'"] : [])],
    ["style-src", "'self'", "'unsafe-inline'"],
    ["img-src", "'self'", "data:", "blob:", ...options.imageOrigins],
    ["font-src", "'self'"],
    ["connect-src", ...connect],
    ["media-src", "'self'"],
    ["object-src", "'none'"],
    ["frame-src", "'none'"],
    ["worker-src", "'self'", "blob:"],
    ["manifest-src", "'self'"],
    ["base-uri", "'self'"],
    ["form-action", "'self'"],
    ["frame-ancestors", "'none'"],
  ];
  if (https && !options.development) directives.push(["upgrade-insecure-requests"]);
  return directives.map((directive) => directive.join(" ")).join("; ");
}

export function buildSecurityHeaders(options: SecurityHeaderOptions): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy(options) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Sign-in uses full-page redirects, not popups, so the opener can be isolated.
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    // Pronunciation uses on-device speech synthesis, which needs none of these features.
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  ];
  // Only after HTTPS is the configured public origin; no includeSubDomains or preload until the host is settled.
  if (options.siteOrigin?.startsWith("https://") && !options.development) {
    headers.push({ key: "Strict-Transport-Security", value: "max-age=31536000" });
  }
  return headers;
}

/** Origins from `images.remotePatterns`, so the CSP and the image allowlist cannot drift apart. */
export function imageOriginsFromRemotePatterns(patterns: readonly Readonly<{ protocol?: string; hostname: string; port?: string }>[]): string[] {
  return [...new Set(patterns.map(({ protocol = "https", hostname, port }) => `${protocol}://${hostname}${port ? `:${port}` : ""}`))];
}
