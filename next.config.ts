

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static export (next export)
  trailingSlash: true, // Optional: adds trailing slashes to all routes (useful for static hosting)
  reactStrictMode: true, // Optional: React dev checks
  // swcMinify: true, // Optional: enables faster build times with SWC
  images: {
    unoptimized: true, // Required for static export when using next/image
  },
};

export default nextConfig;
