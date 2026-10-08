/** Canonical labels only. Additions require an editorial/schema review, never derive vocabularies from records. */
export const dnaVocabulary = Object.freeze({
  genre: Object.freeze(["Action", "Action Adventure", "Action RPG", "Adventure", "Arcade", "Dungeon Crawler", "Exploration", "Horror", "Immersive Sim", "Metroidvania", "Platformer", "Puzzle", "RPG", "Roguelike", "Sci-Fi", "Shooter", "Simulation", "Stealth", "Survival Horror"] as const),
  mood: Object.freeze(["Atmospheric", "Bleak", "Brutal", "Cinematic", "Claustrophobic", "Conspiratorial", "Cozy", "Dark", "Disturbing", "Dreamlike", "Energetic", "Epic", "Haunting", "Hopeful", "Isolation", "Melancholic", "Mysterious", "Nostalgic", "Oppressive", "Paranoid", "Playful", "Political", "Psychological", "Quiet", "Serious", "Stylish", "Surreal", "Tense", "Terrifying", "Thoughtful", "Unsettling"] as const),
  gameplay: Object.freeze(["Boss Battles", "Character Building", "Choices", "Climbing", "Combat", "Companion", "Discovery", "Dungeon Crawling", "Exploration", "Farming", "Infiltration", "Investigation", "Life Simulation", "Platforming", "Puzzle", "Reflexes", "Replayability", "Resource Management", "Role Playing", "Score Attack", "Stealth", "Story", "Survival"] as const),
  difficulty: Object.freeze(["Easy", "Medium", "Hard", "Very Hard"] as const),
  era: Object.freeze(["Before 1990", "1990s", "2000s", "2010s", "2020s"] as const),
  pacing: Object.freeze(["Slow", "Balanced", "Fast"] as const),
  perspective: Object.freeze(["First-person", "Third-person", "Fixed-camera", "Isometric", "Top-down", "Side-view"] as const),
  structure: Object.freeze(["Linear", "Hub-based", "Open world", "Interconnected", "Mission-based", "Run-based", "Sandbox"] as const),
})

export type DNADimension = keyof typeof dnaVocabulary
export type DNAValue<K extends DNADimension> = typeof dnaVocabulary[K][number]
export type GameDNA = {
  genres: DNAValue<"genre">[]
  mood: DNAValue<"mood">[]
  gameplay: DNAValue<"gameplay">[]
  difficulty: DNAValue<"difficulty">
  pacing: DNAValue<"pacing">
  perspective: DNAValue<"perspective">[]
  structure: DNAValue<"structure">
}

export const dnaRecordFields = Object.freeze({ genre: "genres", mood: "mood", gameplay: "gameplay", difficulty: "difficulty", pacing: "pacing", perspective: "perspective", structure: "structure" } as const)

export function isDNAValue<K extends DNADimension>(dimension: K, value: unknown): value is DNAValue<K> {
  return typeof value === "string" && (dnaVocabulary[dimension] as readonly string[]).includes(value)
}

export function gameEra(year: number): DNAValue<"era"> {
  if (!Number.isInteger(year) || year < 1970 || year >= 2030) throw new Error(`Unsupported release year: ${year}`)
  return year < 1990 ? "Before 1990" : `${Math.floor(year / 10) * 10}s` as DNAValue<"era">
}

export function validateGameDNA(record: unknown, year?: number): string[] {
  if (!record || typeof record !== "object") return ["Game DNA must be an object"]
  const values = record as Record<string, unknown>
  const errors: string[] = []
  for (const [dimension, field] of Object.entries(dnaRecordFields)) {
    const value = values[field]
    const multiple = ["genres", "mood", "gameplay", "perspective"].includes(field)
    const entries: unknown[] = multiple ? Array.isArray(value) ? value : [] : [value]
    if (multiple && (!Array.isArray(value) || !entries.length)) errors.push(`${field}: expected a nonempty array`)
    if (new Set(entries).size !== entries.length) errors.push(`${field}: duplicate values`)
    for (const entry of entries) if (!isDNAValue(dimension as DNADimension, entry)) errors.push(`${field}: invalid canonical value ${String(entry)}`)
  }
  if (year !== undefined) {
    try { gameEra(year) } catch { errors.push(`era: unsupported release year ${year}`) }
  }
  if ("era" in values) {
    if (!isDNAValue("era", values.era)) errors.push(`era: invalid canonical value ${String(values.era)}`)
    else if (year !== undefined && !errors.some((error) => error.startsWith("era:")) && values.era !== gameEra(year)) errors.push("era: conflicts with sourced release year")
  }
  return errors
}

export function assertGameDNA(record: unknown, year?: number): asserts record is GameDNA {
  const errors = validateGameDNA(record, year)
  if (errors.length) throw new Error(`Invalid Game DNA: ${errors.join("; ")}`)
}

export function dnaValues(game: GameDNA & { year: number }, dimension: DNADimension): readonly string[] {
  if (dimension === "era") return [gameEra(game.year)]
  const value = game[dnaRecordFields[dimension]]
  return Array.isArray(value) ? value : [value]
}
