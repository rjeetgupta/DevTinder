import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**"
      },
      {
        protocol: 'https',
        hostname: 'www.freepik.com',
        pathname: "/**"
      }
    ],
  },
};

export default nextConfig;
