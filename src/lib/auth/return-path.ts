const fallbackReturnPath = "/account";
const resolutionBase = "http://return-path.invalid";

/**
 * Accepts only same-site paths, checked after URL normalization, so authentication callbacks cannot become open
 * redirects. Dot segments (also percent-encoded `%2e`) can normalize `/account/..//host` into a protocol-relative
 * `//host`, so the raw prefix alone is not enough. Returns the normalized path, query, and fragment.
 */
export function safeAuthReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || /[\\\u0000-\u001f\u007f]/.test(value)) return fallbackReturnPath;
  let url: URL;
  try {
    url = new URL(value, resolutionBase);
  }
  catch {
    return fallbackReturnPath;
  }
  const normalized = `${url.pathname}${url.search}${url.hash}`;
  return url.origin === resolutionBase && isSameSiteRelativePath(normalized) ? normalized : fallbackReturnPath;
}

/** A relative Location that a browser resolves on the current host: one leading slash, never `//` or `/\`. */
export function isSameSiteRelativePath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\");
}
