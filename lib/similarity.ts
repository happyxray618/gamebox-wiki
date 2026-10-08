import type { Game } from "@/data/types"
import { dnaValues, experienceDefinitions, type DNAValue, type DNADimension } from "./game-dna"
import { datasetDistinctiveness, traitDistinctiveness, type Distinctiveness } from "./distinctiveness"

// Base group totals: Identity 64, Interaction 28, Context 8. No rating inputs.
export const semanticGroups = Object.freeze({
  identity: Object.freeze(["experience", "mood", "genre"] as const),
  interaction: Object.freeze(["gameplay", "structure", "pacing"] as const),
  context: Object.freeze(["perspective", "difficulty", "era"] as const),
})
export const similarityWeights = Object.freeze({ experience: 32, mood: 22, genre: 10, gameplay: 12, structure: 10, pacing: 6, perspective: 4, difficulty: 2, era: 2 })
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

export function compareDNA(source: Game, candidate: Game, weights: SimilarityWeights = similarityWeights, corpus: Distinctiveness = datasetDistinctiveness) {
  const dimensions = Object.keys(similarityWeights) as DNADimension[]
  if (dimensions.some(dimension => !Number.isFinite(weights[dimension]) || weights[dimension] <= 0)) throw new Error("Similarity weights must be finite and positive")
  const breakdown = dimensions.map(dimension => {
    const sourceValues = [...dnaValues(source, dimension)].sort(lexical)
    const candidateValues = [...dnaValues(candidate, dimension)].sort(lexical)
    const shared = sourceValues.filter(value => candidateValues.includes(value))
    const union = [...new Set([...sourceValues, ...candidateValues])].sort(lexical)
    const traits = union.map(value => ({ value, frequency: corpus.frequencies[dimension][value] || 0, distinctiveness: traitDistinctiveness(dimension, value, corpus), shared: shared.includes(value) }))
    const unionMass = traits.reduce((sum, trait) => sum + trait.distinctiveness, 0)
    const sharedMass = traits.filter(trait => trait.shared).reduce((sum, trait) => sum + trait.distinctiveness, 0)
    const score = unionMass ? sharedMass / unionMass : 0
    // Symmetric average per-value salience prevents long tag lists gaining arbitrary extra weight.
    const meanSalience = (values: readonly string[]) => values.reduce((sum, value) => sum + traitDistinctiveness(dimension, value, corpus), 0) / Math.max(1, values.length)
    const salience = (meanSalience(sourceValues) + meanSalience(candidateValues)) / 2
    const effectiveWeight = weights[dimension] * salience
    const group = (Object.keys(semanticGroups) as (keyof typeof semanticGroups)[]).find(group => (semanticGroups[group] as readonly string[]).includes(dimension))!
    return { dimension, group, sourceValues, candidateValues, shared, traits, score, salience, weight: weights[dimension], effectiveWeight, contribution: score * effectiveWeight }
  })
  const weightTotal = breakdown.reduce((sum, factor) => sum + factor.effectiveWeight, 0)
  const rawSimilarity = breakdown.reduce((sum, factor) => sum + factor.contribution, 0) / weightTotal * 100
  const sharedDimensions = breakdown.filter(factor => factor.shared.length).sort((a, b) => b.contribution - a.contribution || lexical(a.dimension, b.dimension))
  // Emotional/experiential identity leads whenever there is actual shared identity evidence.
  const meaningful = sharedDimensions.slice().sort((a, b) => Number(b.group === "identity") - Number(a.group === "identity") || b.contribution - a.contribution || lexical(a.dimension, b.dimension))
  const hasExperientialIdentity = meaningful.some(factor => factor.dimension === "experience" || factor.dimension === "mood")
  const explanationFactors = hasExperientialIdentity ? meaningful.filter(factor => factor.group === "identity") : meaningful
  const strongestSharedDNA = explanationFactors.slice(0, 3).map(factor => ({ dimension: factor.dimension, values: factor.traits.filter(trait => trait.shared).sort((a, b) => b.distinctiveness - a.distinctiveness || lexical(a.value, b.value)).slice(0, 2).map(trait => trait.value) }))
  const explanation = strongestSharedDNA.length
    ? `Both games share ${strongestSharedDNA.map(factor => factor.dimension === "experience"
      ? factor.values.map(value => `${value} experiences (${experienceDefinitions[value as DNAValue<"experience">]})`).join(" and ")
      : `${factor.values.join(" / ")} ${factor.dimension}`).join("; ")}.`
    : "No shared Game DNA in the recorded dimensions."
  const groupBreakdown = (Object.keys(semanticGroups) as (keyof typeof semanticGroups)[]).map(group => ({ group,
    effectiveWeight: breakdown.filter(factor => factor.group === group).reduce((sum, factor) => sum + factor.effectiveWeight, 0),
    contribution: breakdown.filter(factor => factor.group === group).reduce((sum, factor) => sum + factor.contribution, 0),
  }))
  return { game: candidate, rawSimilarity, similarityPercentage: Math.round(rawSimilarity * 10) / 10, breakdown, groupBreakdown, weightTotal, corpusSize: corpus.size,
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
