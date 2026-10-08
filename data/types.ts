export type FactField = "title" | "year" | "developers" | "publishers" | "platforms"

export type GameSource = {
  url: string
  label: string
  accessedAt: string
  fields: FactField[]
  revisionId?: string
}

export type GameFacts = {
  id: number
  slug: string
  title: string
  /** Earliest release year listed in the cited original game's infobox. */
  year: number
  developers: string[]
  publishers: string[]
  /** Platforms listed by the source; not a claim of current store availability. */
  platforms: string[]
  sources?: GameSource[]
  verification?: {
    status: "verified" | "partial" | "unverified"
    verifiedAt?: string
    fields: FactField[]
    notes?: string
  }
}

/** GAMEBOX judgements, not external facts or aggregate review scores. */
export type GameEditorial = {
  slug: string
  genres: string[]
  tags: string[]
  difficulty: string
  gameLength: string
  mood: string[]
  gameplay: string[]
  gameboxScore: number
  retroScore: number
  hiddenGemScore: number
  revivalPotential: number
  description: string
  whyPlay: string
  retroHistory: string
  searchKeywords: string[]
  scorePolicy: "provisional-editorial-v1"
}

/** Compatibility view for the existing pages; new integrations can use facts/editorial. */
export type Game = GameEditorial & {
  id: number
  title: string
  year: number
  developer: string
  publisher: string
  platforms: string[]
  facts: GameFacts
  editorial: GameEditorial
}
