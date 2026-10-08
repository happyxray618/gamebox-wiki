# Discovery Experience 1.0

This layer selects intents from Semantic DNA 1.0. It changes no semantic formula, IDF statistics, weights, editorial DNA or quality ratings. BEST MATCH uses the pure semantic ranking, without the diversity pass. All comparisons remain immutable, deterministic and rating-independent. A Hidden Gem editorial rating influences only that mode's eligible selection, never semantic percentage or BEST MATCH.

## Confidence calibration

Whole-number UI percentages use Math.round(raw similarity), clamped to 0–100. Bands use that same displayed number: 80–100 VERY STRONG MATCH; 65–79 STRONG MATCH; 50–64 GOOD MATCH; 35–49 PARTIAL MATCH; 0–34 LIMITED MATCH. Full precision drives selection. Boundary tests include 64.6 → 65 / STRONG MATCH.

One review against all 100 current source games retained the suggested thresholds: 62 best results are VERY STRONG, 20 STRONG, 12 GOOD, 4 PARTIAL and 2 LIMITED. This is a descriptive calibration, not empirical enjoyment confidence. The editorial dataset includes repeated profiles, so high overlap is not proof of equivalent experiences. Thresholds are central in `lib/discovery-experience.ts`; future changes should version the policy and repeat this review.

If the best displayed score is below 65, the page says there is no strong match in the library. Below 35, it explicitly says no close match exists and describes the connections as limited. Limited cards use amber instead of the higher-confidence green. Individual cards always show their own band, even if another mode is strong.

## Mode selection

`discoveryJourney` consumes `rankSimilarGames` and does not mutate its source or import arrays. Ties fall back to semantic rank (which already has title/slug/id tie-breaking).

- **BEST MATCH:** first semantic result; no quality-score input.
- **HIDDEN GEM:** a different result must first clear raw similarity >= max(35, best raw × 0.55), plus shared Experience/Mood with IDF >= 2, plus provisional Hidden Gem score >= 85. Among eligible candidates, highest Hidden Gem score wins, then raw similarity, then semantic rank. A high editorial rating cannot rescue an unrelated game. Scores are provisional signals, not externally verified obscurity/popularity. No eligible result produces an explicit empty state, including Killer7 in this dataset.
- **SURPRISE ME:** outside the top three semantic neighbors, not BEST/HIDDEN, and from a different existing franchise group than the source and best match. It must clear raw similarity >= max(25, best raw × 0.5), plus shared Experience/Mood with IDF >= 2. Selection score = raw similarity × mean distinctiveness of qualifying shared identity traits × (1 − similarity(candidate, best)/100). This favors an explainable relevant contrast, not arbitrary distance. Ties use raw similarity then semantic rank. No randomness or game-specific exception. Limited surprises remain visibly LIMITED MATCH rather than being inflated.
- **MORE GAMES WITH THIS DNA:** next nine pure semantic results, excluding all selected mode games. This continues the journey without duplicate featured recommendations. Cards link to normal game details.

The page begins with WHAT MAKES [GAME] DISTINCTIVE, explains recorded Experience, and highlights the five least-common recorded identity values in the current library. Complete Game DNA is expandable. Three intent sections have explicit labels and selection reasons; the remainder is secondary. No tracking or feedback controls are active.

## Product regressions

Run `npm run report:discovery` for actual choices, reasons, explanations and confidence distribution in `discovery-experience-regression.md`. Important residual limits are honest: Vagrant Story → Suikoden II is only a 32% limited surprise, while Killer7 has no eligible Hidden Gem and only limited best/surprise candidates. No model retuning was used to hide these outcomes.

Tests cover all 100 deterministic journeys, whole-number boundary consistency, duplicate/self exclusion, hard relevance prerequisites, unavailable modes, empty corpus, library honesty and source immutability. `check:links` verifies expected page card counts, all four discovery sections, confidence labels, whole percentages, canonical/sitemap/internal links and invalid-route 404s.
