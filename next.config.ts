import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thumb.wikimedia.org",
        pathname: "/wikipedia/commons/thumb/**",
      },
    ],
  },
};
export default nextConfig;
