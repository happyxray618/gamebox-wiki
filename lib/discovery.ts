import type { Game } from "@/data/games"

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

export function filterGames(games: Game[], filters: Filters) {
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
