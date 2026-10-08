import type { NextConfig } from "next";
import { isIndexableDeployment } from "./lib/public-config";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ...(!isIndexableDeployment() ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : [])] }]
  },
};

export default nextConfig;
