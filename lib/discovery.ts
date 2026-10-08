import type { Game } from "@/data/games"
import { games } from "@/data/games"
import { dnaVocabulary, dnaValues, type DNADimension } from "@/lib/game-dna"
import { searchMatch } from "@/lib/search"
export { gameEra } from "@/lib/game-dna"

export const eras = dnaVocabulary.era

export type Filters = {
  experience: string
  query: string
  genre: string
  platform: string
  difficulty: string
  mood: string
  gameplay: string
  era: string
  pacing: string
  perspective: string
  structure: string
}

export const emptyFilters: Filters = {
  experience: "",
  query: "", genre: "", platform: "", difficulty: "", mood: "", gameplay: "", era: "", pacing: "", perspective: "", structure: "",
}

export const filterOptions = Object.freeze({
  platform: Object.freeze([...new Set(games.flatMap((game) => game.platforms))].sort()),
  ...dnaVocabulary,
})

export const sortOptions = ["match", "score", "title", "newest", "oldest"] as const
export type CatalogSort = typeof sortOptions[number]

export function parseCatalogParams(params: Pick<URLSearchParams, "get">, defaultSort: CatalogSort = "score"): { filters: Filters; sort: CatalogSort } {
  const filters = { ...emptyFilters, query: (params.get("q") || "").slice(0, 200) }
  for (const key of Object.keys(filterOptions) as (keyof typeof filterOptions)[]) {
    const value = params.get(key) || ""
    filters[key] = (filterOptions[key] as readonly string[]).includes(value) ? value : ""
  }
  const sort = params.get("sort")
  return { filters, sort: sortOptions.includes(sort as CatalogSort) ? sort as CatalogSort : defaultSort }
}

export function catalogQuery(filters: Filters, sort: CatalogSort = "score", defaultSort: CatalogSort = "score") {
  const params = new URLSearchParams()
  if (filters.query) params.set("q", filters.query.slice(0, 200))
  for (const key of Object.keys(filterOptions) as (keyof typeof filterOptions)[]) {
    if (filters[key] && (filterOptions[key] as readonly string[]).includes(filters[key])) params.set(key, filters[key])
  }
  if (sort !== defaultSort) params.set("sort", sort)
  return params.toString()
}

export function filterGames(games: readonly Game[], filters: Filters) {
  const query = filters.query.trim().toLowerCase()
  return games.filter((game) =>
    (!query || searchMatch(game, query) > 0) &&
    (!filters.platform || game.platforms.includes(filters.platform)) &&
    (Object.keys(dnaVocabulary) as DNADimension[]).every((dimension) => !filters[dimension] || dnaValues(game, dimension).includes(filters[dimension]))
  )
}
