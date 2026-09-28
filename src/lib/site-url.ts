import { readPublicSiteOrigin } from "@/lib/config/deployment-config";

// Production URL metadata stays opt-in until the hosted-integration gate; local builds must never imply that localhost is the public canonical host.
// The shared reader rejects credentials, paths, queries, and fragments, so only the normalized origin reaches metadata and the sitemap.
const configuredSiteOrigin = readPublicSiteOrigin({ NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL });

export const hasConfiguredPublicSiteUrl = Boolean(configuredSiteOrigin);
export const siteUrl = new URL(configuredSiteOrigin ?? "http://localhost:3000");
