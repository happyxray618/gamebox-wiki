import type { Game } from "@/data/types"
import type { Filters } from "@/lib/discovery"
import { dnaVocabulary, dnaValues, isDNAValue, type DNADimension } from "@/lib/game-dna"
import { searchEvidence } from "@/lib/search"

export type RankingDimension = DNADimension | "query" | "platform"
export type RankingSort = "match" | "score" | "title" | "newest" | "oldest"
export type RankingWeights = Readonly<Record<RankingDimension, number>>
export const rankingWeights: RankingWeights = Object.freeze({
  experience: 20,
  mood: 20, gameplay: 20, genre: 12, pacing: 12, perspective: 8,
  structure: 12, difficulty: 6, era: 5, query: 24, platform: 8,
})

/** Array-valued intent also supports future similarity callers without a Finder UI dependency. */
export type RankingIntent = {
  dna?: Partial<Record<DNADimension, readonly string[]>>
  query?: string
  platform?: string
}
export type MatchFactor = {
  dimension: RankingDimension
  requested: readonly string[]
  matched: readonly string[]
  weight: number
  strength: number
  contribution: number
  evidence: string
}
export type RankedGame = {
  game: Game
  hasIntent: boolean
  /** 0–100, displayed to one decimal; raw relevance remains unrounded for ordering. */
  totalMatchScore: number
  rawMatchScore: number
  factors: readonly MatchFactor[]
  matchedDNA: readonly string[]
  explanation: string
  unmetPreferences: readonly string[]
}

export function intentFromFilters(filters: Filters): RankingIntent {
  const dna: RankingIntent["dna"] = {}
  for (const dimension of Object.keys(dnaVocabulary) as DNADimension[]) {
    if (filters[dimension]) dna[dimension] = [filters[dimension]]
  }
  return { dna, query: filters.query.trim(), platform: filters.platform }
}

function validateIntent(intent: RankingIntent, weights: RankingWeights) {
  for (const dimension of Object.keys(rankingWeights) as RankingDimension[]) {
    if (!Number.isFinite(weights[dimension]) || weights[dimension] <= 0) throw new Error(`Invalid ranking weight: ${dimension}`)
  }
  for (const [dimension, values] of Object.entries(intent.dna || {})) {
    if (!Object.hasOwn(dnaVocabulary, dimension) || !Array.isArray(values) || !values.length || new Set(values).size !== values.length || values.some((value) => !isDNAValue(dimension as DNADimension, value))) {
      throw new Error(`Invalid ranking intent: ${dimension}`)
    }
  }
}

function calculateMatch(game: Game, intent: RankingIntent, weights: RankingWeights): RankedGame {
  const factors: MatchFactor[] = []
  for (const dimension of Object.keys(dnaVocabulary) as DNADimension[]) {
    const requested = intent.dna?.[dimension]
    if (!requested?.length) continue
    const matched = requested.filter((value) => dnaValues(game, dimension).includes(value))
    const strength = matched.length / requested.length
    factors.push({ dimension, requested: [...requested], matched, weight: weights[dimension], strength,
      contribution: weights[dimension] * strength,
      evidence: matched.length ? `${dimension}: ${matched.join(", ")}` : `No ${dimension} preference matched` })
  }
  const query = intent.query?.trim()
  if (query) {
    const evidence = searchEvidence(game, query)
    factors.push({ dimension: "query", requested: [query], matched: evidence.strength ? [evidence.value] : [],
      weight: weights.query, strength: evidence.strength, contribution: weights.query * evidence.strength,
      evidence: evidence.strength ? `Search “${query}” matches ${evidence.field}: ${evidence.value}` : `Search “${query}” does not match` })
  }
  if (intent.platform) {
    const strength = game.platforms.includes(intent.platform) ? 1 : 0
    factors.push({ dimension: "platform", requested: [intent.platform], matched: strength ? [intent.platform] : [],
      weight: weights.platform, strength, contribution: weights.platform * strength,
      evidence: strength ? `Listed platform: ${intent.platform}` : `Platform ${intent.platform} is not listed` })
  }
  const weight = factors.reduce((sum, factor) => sum + factor.weight, 0)
  const contribution = factors.reduce((sum, factor) => sum + factor.contribution, 0)
  const rawMatchScore = weight ? contribution / weight * 100 : 0
  const dnaFactors = factors.filter((factor) => factor.dimension !== "query" && factor.dimension !== "platform")
  const matchedDNA = [...new Set(dnaFactors.flatMap((factor) => factor.matched))]
  const unmetPreferences = dnaFactors.flatMap((factor) => factor.requested.filter((value) => !factor.matched.includes(value)))
  const dnaReasons = dnaFactors.filter((factor) => factor.matched.length).map((factor) => `${factor.matched.join(" / ")} ${factor.dimension}`)
  const dnaReason = dnaReasons.length > 1 ? `${dnaReasons.slice(0, -1).join(", ")} and ${dnaReasons.at(-1)}` : dnaReasons[0]
  const reasons = [
    ...(dnaReason ? [`Matches your ${dnaReason} preferences`] : []),
    ...factors.filter((factor) => ["query", "platform"].includes(factor.dimension) && factor.matched.length).map((factor) => factor.evidence),
  ]
  return { game, hasIntent: factors.length > 0, rawMatchScore,
    totalMatchScore: Math.round(rawMatchScore * 10) / 10, factors, matchedDNA, unmetPreferences,
    explanation: reasons.length ? `${reasons.join(". ")}.` : factors.length ? "None of your selected preferences match this game's recorded DNA." : "Choose Game DNA preferences to see a match score and the reasons behind it." }
}

/** Evaluates any game, including weaker/non-matches; no hidden editorial score contribution. */
export function scoreGame(game: Game, intent: RankingIntent, weights: RankingWeights = rankingWeights): RankedGame {
  validateIntent(intent, weights)
  return calculateMatch(game, intent, weights)
}

function textOrder(left: string, right: string) { return left < right ? -1 : left > right ? 1 : 0 }
export function compareRankedGames(left: RankedGame, right: RankedGame, tieBreak: RankingSort = "match") {
  const requestedTie = tieBreak === "title" ? textOrder(left.game.title.toLowerCase(), right.game.title.toLowerCase()) :
    tieBreak === "newest" ? right.game.year - left.game.year : tieBreak === "oldest" ? left.game.year - right.game.year : 0
  return right.rawMatchScore - left.rawMatchScore || requestedTie || right.game.gameboxScore - left.game.gameboxScore ||
    textOrder(left.game.title.toLowerCase(), right.game.title.toLowerCase()) || textOrder(left.game.slug, right.game.slug) || left.game.id - right.game.id
}

/** Search/platform are requirements; DNA preferences are ranked, with zero-overlap games excluded. */
export function rankGames(games: readonly Game[], intent: RankingIntent, weights: RankingWeights = rankingWeights, tieBreak: RankingSort = "match"): RankedGame[] {
  validateIntent(intent, weights)
  const hasDNA = Object.keys(intent.dna || {}).length > 0
  return games.map((game) => calculateMatch(game, intent, weights))
    .filter((result) => result.factors.every((factor) => !["query", "platform"].includes(factor.dimension) || factor.strength > 0) && (!hasDNA || result.matchedDNA.length > 0))
    .sort((left, right) => compareRankedGames(left, right, tieBreak))
}
