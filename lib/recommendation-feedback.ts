import type { DiscoveryMode } from "./discovery-experience"

/** Contract only: no storage, cookies, accounts, tracking or network emission. */
export type RecommendationFeedbackEvent = {
  name: "recommendation_impression" | "recommendation_click" | "recommendation_good_match" | "recommendation_not_for_me"
  schemaVersion: 1
  occurredAt: string // UTC ISO-8601
  impressionId: string // ephemeral random id, reused only for this card exposure
  sourceSlug: string
  candidateSlug: string
  surface: "games_like" | "game_detail"
  mode: DiscoveryMode | "more_dna" | "similar_games"
  position: number // one-based within its section
  similarityRaw: number // 0–100
  similarityDisplayed: number // rounded whole number
  confidenceLabel: string
  similarityModelVersion: "semantic-dna-1.0"
  discoveryPolicyVersion: "discovery-experience-1.0"
  datasetVersion: string // content revision/hash, not merely dataset size
  sharedDNA: { dimension: string; values: string[] }[]
}
