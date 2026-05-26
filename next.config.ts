import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "gameinfohub.com",
          },
        ],
        destination: "https://www.gameinfohub.com/:path*",
        permanent: true,
      },
    ];
  },
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
      {
        protocol: "https",
        hostname: "www.gameinfohub.com",
      },
    ],
  },
};

export default nextConfig;
