import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dbxor1568.mycafe24.com",
      },
      {
        protocol: "https",
        hostname: "gameinfohub.com",
      },
    ],
  },
};

export default nextConfig;
