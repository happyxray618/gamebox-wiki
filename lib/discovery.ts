import type { Game } from "@/data/games"
import { games } from "@/data/games"

export const eras = ["Before 1990", "1990s", "2000s", "2010s", "2020s"]

export function gameEra(year: number) {
  if (year < 1990) return eras[0]
  return `${Math.floor(year / 10) * 10}s`
}

export type Filters = {
  query: string
  genre: string
  platform: string
  difficulty: string
  mood: string
  gameplay: string
  era: string
}

export const emptyFilters: Filters = {
  query: "", genre: "", platform: "", difficulty: "", mood: "", gameplay: "", era: "",
}

export const filterOptions = {
  genre: [...new Set(games.flatMap((game) => game.genres))].sort(),
  platform: [...new Set(games.flatMap((game) => game.platforms))].sort(),
  difficulty: [...new Set(games.map((game) => game.difficulty))].sort(),
  mood: [...new Set(games.flatMap((game) => game.mood))].sort(),
  gameplay: [...new Set(games.flatMap((game) => game.gameplay))].sort(),
  era: [...new Set(games.map((game) => gameEra(game.year)))].sort(),
}

export const sortOptions = ["score", "title", "newest", "oldest"] as const
export type CatalogSort = typeof sortOptions[number]

export function parseCatalogParams(params: Pick<URLSearchParams, "get">): { filters: Filters; sort: CatalogSort } {
  const filters = { ...emptyFilters, query: (params.get("q") || "").slice(0, 200) }
  for (const key of Object.keys(filterOptions) as (keyof typeof filterOptions)[]) {
    const value = params.get(key) || ""
    filters[key] = filterOptions[key].includes(value) ? value : ""
  }
  const sort = params.get("sort")
  return { filters, sort: sortOptions.includes(sort as CatalogSort) ? sort as CatalogSort : "score" }
}

export function catalogQuery(filters: Filters, sort: CatalogSort = "score") {
  const params = new URLSearchParams()
  if (filters.query) params.set("q", filters.query.slice(0, 200))
  for (const key of Object.keys(filterOptions) as (keyof typeof filterOptions)[]) {
    if (filters[key] && filterOptions[key].includes(filters[key])) params.set(key, filters[key])
  }
  if (sort !== "score") params.set("sort", sort)
  return params.toString()
}

export function filterGames(games: readonly Game[], filters: Filters) {
  const query = filters.query.trim().toLowerCase()
  return games.filter((game) =>
    (!query || [game.title, game.developer, game.publisher, ...game.genres,
      ...game.tags, ...game.platforms, ...game.mood, ...game.gameplay,
      ...game.searchKeywords].some((value) => value.toLowerCase().includes(query))) &&
    (!filters.genre || game.genres.includes(filters.genre)) &&
    (!filters.platform || game.platforms.includes(filters.platform)) &&
    (!filters.difficulty || game.difficulty === filters.difficulty) &&
    (!filters.mood || game.mood.includes(filters.mood)) &&
    (!filters.gameplay || game.gameplay.includes(filters.gameplay)) &&
    (!filters.era || gameEra(game.year) === filters.era)
  )
}
