import type { Game } from "@/data/types"
import { dnaValues, type DNADimension } from "./game-dna"

// Independent from Finder: symmetric weighted Jaccard, with no rating inputs.
export const similarityWeights = Object.freeze({ genre: 16, mood: 20, gameplay: 24, pacing: 12, structure: 12, perspective: 8, difficulty: 5, era: 3 })
export type SimilarityWeights = Readonly<Record<DNADimension, number>>
export const diversityPolicy = Object.freeze({ maxGap: 5, minimumRelativeScore: 0.9, duplicateThreshold: 95 })

// Explicit editorial grouping; never infer a franchise from a title prefix.
export const franchiseGroups: readonly (readonly string[])[] = Object.freeze([
  ["silent-hill", "silent-hill-2", "silent-hill-3", "silent-hill-4-the-room"],
  ["resident-evil", "resident-evil-2", "resident-evil-4"],
  ["portal", "portal-2"], ["half-life", "half-life-2"],
  ["bioshock", "bioshock-2", "bioshock-infinite"], ["dishonored", "dishonored-2"],
  ["fallout", "fallout-2", "fallout-new-vegas"],
  ["baldur-s-gate", "baldur-s-gate-ii-shadows-of-amn"],
  ["the-elder-scrolls-iii-morrowind", "the-elder-scrolls-iv-oblivion", "the-elder-scrolls-v-skyrim"],
  ["mass-effect", "mass-effect-2"], ["final-fantasy-vi", "final-fantasy-vii", "final-fantasy-ix", "final-fantasy-x"],
  ["the-legend-of-zelda-ocarina-of-time", "the-legend-of-zelda-majora-s-mask", "the-legend-of-zelda-the-wind-waker"],
  ["super-metroid", "metroid-prime"], ["super-mario-64", "super-mario-world", "paper-mario-the-thousand-year-door"],
  ["metal-gear-solid", "metal-gear-solid-2", "metal-gear-solid-3-snake-eater"],
].map(group => Object.freeze(group)))

function family(slug: string): string {
  return franchiseGroups.find(group => group.includes(slug))?.[0] ?? slug
}
function lexical(a: string, b: string) { return a < b ? -1 : a > b ? 1 : 0 }

export function compareDNA(source: Game, candidate: Game, weights: SimilarityWeights = similarityWeights) {
  const dimensions = Object.keys(similarityWeights) as DNADimension[]
  if (dimensions.some(dimension => !Number.isFinite(weights[dimension]) || weights[dimension] <= 0)) throw new Error("Similarity weights must be finite and positive")
  const weightTotal = dimensions.reduce((sum, dimension) => sum + weights[dimension], 0)
  const breakdown = dimensions.map(dimension => {
    const sourceValues = [...dnaValues(source, dimension)]
    const candidateValues = [...dnaValues(candidate, dimension)]
    const shared = sourceValues.filter(value => candidateValues.includes(value))
    const union = new Set([...sourceValues, ...candidateValues]).size
    const score = union ? shared.length / union : 0
    return { dimension, sourceValues, candidateValues, shared, score, weight: weights[dimension], contribution: score * weights[dimension] }
  })
  const rawSimilarity = breakdown.reduce((sum, factor) => sum + factor.contribution, 0) / weightTotal * 100
  const sharedDimensions = breakdown.filter(factor => factor.shared.length).sort((a, b) => b.contribution - a.contribution || lexical(a.dimension, b.dimension))
  const strongestSharedDNA = sharedDimensions.slice(0, 3).map(factor => ({ dimension: factor.dimension, values: [...factor.shared] }))
  const explanation = strongestSharedDNA.length
    ? `Both games share ${strongestSharedDNA.map(factor => `${factor.values.join(" / ")} ${factor.dimension}`).join("; ")}.`
    : "No shared Game DNA in the recorded dimensions."
  return { game: candidate, rawSimilarity, similarityPercentage: Math.round(rawSimilarity * 10) / 10, breakdown,
    sharedDNA: sharedDimensions.map(factor => ({ dimension: factor.dimension, values: [...factor.shared] })), strongestSharedDNA,
    explanationData: strongestSharedDNA, explanation }
}
export type SimilarGame = ReturnType<typeof compareDNA> & { diversityAdjusted?: boolean }

export function rankSimilarGames(source: Game, candidates: readonly Game[], weights: SimilarityWeights = similarityWeights): SimilarGame[] {
  return candidates.filter(game => game.slug !== source.slug && game.id !== source.id)
    .map(game => compareDNA(source, game, weights)).filter(match => match.rawSimilarity > 0)
    .sort((a, b) => b.rawSimilarity - a.rawSimilarity || lexical(a.game.title.toLowerCase(), b.game.title.toLowerCase()) || lexical(a.game.slug, b.game.slug) || a.game.id - b.game.id)
}

/** Keep #1, then favor fresh families / DNA profiles only within a small relevance window. */
export function recommendSimilarGames(source: Game, candidates: readonly Game[], limit = 6, weights: SimilarityWeights = similarityWeights): SimilarGame[] {
  const remaining = rankSimilarGames(source, candidates, weights)
  const selected: SimilarGame[] = []
  const seenFamilies = new Set([family(source.slug)])
  const count = Math.max(0, Math.floor(Number.isFinite(limit) ? limit : 6))
  while (remaining.length && selected.length < count) {
    const best = remaining[0]
    let index = 0
    if (selected.length) {
      const alternative = remaining.findIndex(match => best.rawSimilarity - match.rawSimilarity <= diversityPolicy.maxGap
        && match.rawSimilarity >= best.rawSimilarity * diversityPolicy.minimumRelativeScore
        && !seenFamilies.has(family(match.game.slug))
        && !selected.some(previous => compareDNA(previous.game, match.game, weights).rawSimilarity >= diversityPolicy.duplicateThreshold))
      if (alternative >= 0) index = alternative
    }
    const [match] = remaining.splice(index, 1)
    selected.push({ ...match, diversityAdjusted: index > 0 })
    seenFamilies.add(family(match.game.slug))
  }
  return selected
}
