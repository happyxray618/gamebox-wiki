import { games, type Game } from "@/data/games"

export const discoveryKinds = ["genres", "platforms", "moods", "gameplay"] as const
export type DiscoveryKind = typeof discoveryKinds[number]
export const taxonomyFields = { genres: "genres", platforms: "platforms", moods: "mood", gameplay: "gameplay" } as const
export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}
export function discoveryValues(kind: DiscoveryKind) {
  const values = [...new Set(games.flatMap((game) => game[taxonomyFields[kind]]))].sort()
  return values.map((value) => ({ value, slug: slugify(value) }))
}
export function discoveryValue(kind: DiscoveryKind, slug: string) {
  return discoveryValues(kind).find((item) => item.slug === slug)
}
export function discoveryGames(kind: DiscoveryKind, value: string): Game[] {
  return games.filter((game) => game[taxonomyFields[kind]].includes(value))
    .sort((a, b) => b.gameboxScore - a.gameboxScore || a.title.localeCompare(b.title))
}
export function discoveryPaths() {
  return discoveryKinds.flatMap((kind) => discoveryValues(kind).map(({ slug }) => `/${kind}/${slug}`))
}
