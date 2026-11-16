import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/nobodyworkshop", destination: "/nobodyworkshop/index.html" },
      { source: "/nobodyworkshop/winter-atelier", destination: "/nobodyworkshop/winter-atelier/index.html" },
    ];
  },
};

export default nextConfig;
