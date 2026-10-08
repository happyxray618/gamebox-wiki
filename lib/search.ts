import type { Game } from "@/data/types"

export const searchWeights = Object.freeze({ titleExact: 1, titleContains: 0.9, credits: 0.7, metadata: 0.5 })

export function searchEvidence(game: Game, query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return { strength: 0, field: "", value: "" }
  if (game.title.toLowerCase() === normalized) return { strength: searchWeights.titleExact, field: "title", value: game.title }
  if (game.title.toLowerCase().includes(normalized)) return { strength: searchWeights.titleContains, field: "title", value: game.title }
  for (const [field, values] of [
    ["credits", [game.developer, game.publisher]],
    ["Game DNA", [...game.experience, ...game.genres, ...game.mood, ...game.gameplay, game.difficulty, game.pacing, ...game.perspective, game.structure]],
    ["keywords", [...game.tags, ...game.platforms, ...game.searchKeywords]],
  ] as const) {
    const value = values.find((value) => value.toLowerCase().includes(normalized))
    if (value) return { strength: field === "credits" ? searchWeights.credits : searchWeights.metadata, field, value }
  }
  return { strength: 0, field: "", value: "" }
}

export function searchMatch(game: Game, query: string) { return searchEvidence(game, query).strength }
