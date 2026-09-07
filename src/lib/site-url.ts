// Production URL metadata stays opt-in until the hosted-integration gate; local builds must never imply that localhost is the public canonical host.
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const hasConfiguredPublicSiteUrl = Boolean(configuredSiteUrl);
export const siteUrl = new URL(configuredSiteUrl ?? "http://localhost:3000");
