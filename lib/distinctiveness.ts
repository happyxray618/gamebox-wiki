import { games } from "@/data/games"
import type { Game } from "@/data/types"
import { dnaValues, dnaVocabulary, type DNADimension } from "./game-dna"

/** One count per game/value/dimension. Corpus order and candidate subsets cannot alter the model. */
export function buildDistinctiveness(corpus: readonly Game[]) {
  const dimensions = Object.keys(dnaVocabulary) as DNADimension[]
  const frequencies = Object.fromEntries(dimensions.map(dimension => {
    const counts = Object.fromEntries(dnaVocabulary[dimension].map(value => [value, 0]))
    for (const game of corpus) for (const value of new Set(dnaValues(game, dimension))) counts[value] = (counts[value] || 0) + 1
    return [dimension, Object.freeze(counts)]
  })) as Record<DNADimension, Readonly<Record<string, number>>>
  return Object.freeze({ size: corpus.length, frequencies: Object.freeze(frequencies) })
}
export type Distinctiveness = ReturnType<typeof buildDistinctiveness>
export const datasetDistinctiveness = buildDistinctiveness(games)

/** Smoothed inverse document frequency: common values approach 1; rare values provide more evidence. */
export function traitDistinctiveness(dimension: DNADimension, value: string, corpus: Distinctiveness = datasetDistinctiveness) {
  return 1 + Math.log((corpus.size + 1) / ((corpus.frequencies[dimension][value] || 0) + 1))
}
