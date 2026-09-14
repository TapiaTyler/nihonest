import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "192.168.1.34"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  images: {
    remotePatterns: [
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
    ],
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
