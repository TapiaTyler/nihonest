import type { MetadataRoute } from "next";
import { hasConfiguredPublicSiteUrl, siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // An unset public URL identifies local/staging builds, which should not be indexed accidentally.
  if (!hasConfiguredPublicSiteUrl) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl.origin,
  };
}
