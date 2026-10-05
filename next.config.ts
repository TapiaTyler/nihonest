import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { assertArticleMetadataFresh } from "./src/lib/build/article-metadata-freshness";
import { readPublicSiteOrigin, readSupabasePublicSettings } from "./src/lib/config/deployment-config";
import { buildSecurityHeaders, imageOriginsFromRemotePatterns } from "./src/lib/config/security-headers";

const development = process.env.NODE_ENV === "development";

const remoteImagePatterns = [
  {
    protocol: "https",
    hostname: "www.kojinbango-card.go.jp",
    pathname: "/hpsv/wpmng/assets/img/faq/**",
  },
  {
    protocol: "https",
    hostname: "www.moj.go.jp",
    pathname: "/isa/content/*.jpg",
  },
] as const;

// Development-only hosts (for example a phone on the LAN). Local, comma-separated; never a deployment setting.
const devOrigins = (process.env.NIHONEST_DEV_ALLOWED_ORIGINS ?? "").split(",").map((value) => value.trim()).filter(Boolean);

const securityHeaders = buildSecurityHeaders({
  siteOrigin: readPublicSiteOrigin(process.env),
  supabaseOrigin: readSupabasePublicSettings(process.env).value?.url,
  imageOrigins: imageOriginsFromRemotePatterns(remoteImagePatterns),
  development,
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", ...devOrigins],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [...remoteImagePatterns],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withMDX = createMDX();

export default function config(phase: string): NextConfig {
  // A production build must not ship metadata that disagrees with the canonical MDX; dev and tests skip this.
  if (phase === PHASE_PRODUCTION_BUILD) assertArticleMetadataFresh();
  return withMDX(nextConfig);
}
