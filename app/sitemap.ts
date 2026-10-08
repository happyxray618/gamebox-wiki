import type { MetadataRoute } from "next"
import { games } from "@/data/games"
import { siteUrl } from "@/lib/metadata"
import { discoveryPaths } from "@/lib/taxonomy"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/games", "/finder", "/retro", "/hidden-gems",
    ...games.map((game) => `/games/${game.slug}`), ...games.map((game) => `/games-like/${game.slug}`), ...discoveryPaths(),
    ...["ps1", "ps2", "dreamcast", "xbox", "gamecube", "arcade"].map((platform) => `/retro/${platform}`)]
  return paths.map((path) => ({ url: new URL(path || "/", siteUrl).href }))
}
