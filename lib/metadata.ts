import type { Metadata } from "next"

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gamebox.wiki"

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title: `${title} | GAMEBOX.WIKI`, description, url: path, siteName: "GAMEBOX.WIKI", type: "website" },
    twitter: { card: "summary", title: `${title} | GAMEBOX.WIKI`, description },
  }
}
