import factRecords from "./game-facts.json"
import editorialRecords from "./game-editorial.json"
import type { Game, GameFacts, GameEditorial } from "./types"

export type { Game, GameFacts, GameEditorial, GameSource, FactField } from "./types"

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child)
    Object.freeze(value)
  }
  return value
}

export const gameFacts: readonly GameFacts[] = deepFreeze(factRecords as GameFacts[])
export const gameEditorial: readonly GameEditorial[] = deepFreeze(editorialRecords as GameEditorial[])
const editorialBySlug = new Map(gameEditorial.map((entry) => [entry.slug, entry]))

export const games: readonly Game[] = deepFreeze(gameFacts.map((facts) => {
  const editorial = editorialBySlug.get(facts.slug)
  if (!editorial) throw new Error(`Missing GAMEBOX editorial record: ${facts.slug}`)
  return {
    ...editorial,
    id: facts.id,
    title: facts.title,
    year: facts.year,
    developer: facts.developers.join(" · "),
    publisher: facts.publishers.join(" · "),
    platforms: facts.platforms,
    facts,
    editorial,
  }
}))
