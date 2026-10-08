import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/metadata"
import { isIndexableDeployment } from "@/lib/public-config"

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, ...(isIndexableDeployment() ? { sitemap: new URL("/sitemap.xml", siteUrl).href } : {}) }
}
