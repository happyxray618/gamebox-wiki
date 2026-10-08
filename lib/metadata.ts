import type { Metadata } from "next"
import { resolveSiteUrl } from "./public-config"

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title: `${title} | GAMEBOX.WIKI`, description, url: path, siteName: "GAMEBOX.WIKI", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "GAMEBOX.WIKI — explained game discovery" }] },
    twitter: { card: "summary_large_image", title: `${title} | GAMEBOX.WIKI`, description, images: ["/opengraph-image"] },
  }
}
