import type { Game } from "@/data/types"
import { compareDNA, franchiseGroups, rankSimilarGames, type SimilarGame } from "./similarity"

export const confidenceBands = Object.freeze([
  { minimum: 80, label: "VERY STRONG MATCH" }, { minimum: 65, label: "STRONG MATCH" },
  { minimum: 50, label: "GOOD MATCH" }, { minimum: 35, label: "PARTIAL MATCH" },
  { minimum: 0, label: "LIMITED MATCH" },
] as const)
export function displaySimilarity(raw: number) { return Math.round(Math.max(0, Math.min(100, Number.isFinite(raw) ? raw : 0))) }
export function matchConfidence(raw: number) { return confidenceBands.find(band => displaySimilarity(raw) >= band.minimum)!.label }
export type DiscoveryMode = "best_match" | "hidden_gem" | "surprise_me"
export const discoveryPolicy = Object.freeze({ hiddenMinimum: 35, hiddenRelative: 0.55, hiddenScoreMinimum: 85, surpriseMinimum: 25, surpriseRelative: 0.5, surpriseSkip: 3, distinctiveMinimum: 2 })
export type DiscoveryPick = { mode: DiscoveryMode; match: SimilarGame; reason: string }
function family(slug: string) { return franchiseGroups.find(group => group.includes(slug))?.[0] ?? slug }
export function distinctiveIdentity(match: SimilarGame) {
  return match.breakdown.filter(factor => factor.dimension === "experience" || factor.dimension === "mood")
    .flatMap(factor => factor.traits.filter(trait => trait.shared && trait.distinctiveness >= discoveryPolicy.distinctiveMinimum)
      .map(trait => ({ dimension: factor.dimension, value: trait.value, distinctiveness: trait.distinctiveness })))
    .sort((a, b) => b.distinctiveness - a.distinctiveness || a.value.localeCompare(b.value, "en"))
}

/** Intent selection only; semantic scoring, weights, data and ordering remain untouched. */
export function discoveryJourney(source: Game, candidates: readonly Game[]) {
  const ranked = rankSimilarGames(source, candidates)
  const best = ranked[0]
  const bestMatch: DiscoveryPick | null = best ? { mode: "best_match", match: best, reason: "The highest semantic similarity in the current library. Ratings do not influence this choice." } : null
  const hiddenFloor = Math.max(discoveryPolicy.hiddenMinimum, (best?.rawSimilarity ?? 0) * discoveryPolicy.hiddenRelative)
  const hidden = ranked.filter(match => match.game.slug !== best?.game.slug && match.rawSimilarity >= hiddenFloor
    && match.game.hiddenGemScore >= discoveryPolicy.hiddenScoreMinimum && distinctiveIdentity(match).length)
    .sort((a, b) => b.game.hiddenGemScore - a.game.hiddenGemScore || b.rawSimilarity - a.rawSimilarity || ranked.indexOf(a) - ranked.indexOf(b))[0]
  const hiddenGem: DiscoveryPick | null = hidden ? { mode: "hidden_gem", match: hidden,
    reason: `A shared-DNA alternative highlighted by a provisional GAMEBOX Hidden Gem rating of ${hidden.game.hiddenGemScore}/100.` } : null
  const surpriseFloor = Math.max(discoveryPolicy.surpriseMinimum, (best?.rawSimilarity ?? 0) * discoveryPolicy.surpriseRelative)
  const surprises = ranked.slice(discoveryPolicy.surpriseSkip).filter(match => match.rawSimilarity >= surpriseFloor
    && match.game.slug !== hidden?.game.slug && distinctiveIdentity(match).length
    && family(match.game.slug) !== family(source.slug) && family(match.game.slug) !== family(best!.game.slug))
    .map(match => {
      const evidence = distinctiveIdentity(match)
      const distinctiveness = evidence.reduce((sum, trait) => sum + trait.distinctiveness, 0) / evidence.length
      const difference = 1 - compareDNA(best!.game, match.game).rawSimilarity / 100
      return { match, selectionScore: match.rawSimilarity * distinctiveness * difference }
    }).sort((a, b) => b.selectionScore - a.selectionScore || b.match.rawSimilarity - a.match.rawSimilarity || ranked.indexOf(a.match) - ranked.indexOf(b.match))
  const surprise = surprises[0]?.match
  const surpriseMe: DiscoveryPick | null = surprise ? { mode: "surprise_me", match: surprise,
    reason: `A different series and a less-obvious direction, connected by distinctive ${distinctiveIdentity(surprise).slice(0, 2).map(trait => trait.value).join(" / ")} DNA. Explore a contrast to the closest recommendation.` } : null
  const featured = new Set([best?.game.slug, hidden?.game.slug, surprise?.game.slug].filter(Boolean))
  const more = ranked.filter(match => !featured.has(match.game.slug)).slice(0, 9)
  const honesty = !best ? "No shared Game DNA found in the current library. Explore the Finder to try a different starting point."
    : displaySimilarity(best.rawSimilarity) < 35 ? "GAMEBOX found shared DNA, but no close match currently exists in the library. These are limited connections to explore."
    : displaySimilarity(best.rawSimilarity) < 65 ? "No strong match currently exists in the library. These recommendations share meaningful DNA, with important differences."
    : null
  return { bestMatch, hiddenGem, surpriseMe, more, honesty, hiddenFloor, surpriseFloor }
}
