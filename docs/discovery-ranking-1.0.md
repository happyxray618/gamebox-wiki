# Discovery ranking 1.0 / Game DNA 1.0

`lib/game-dna.ts` is the controlled registry for genre, mood, gameplay, difficulty, era, pacing, perspective and structure. Labels are case-sensitive canonical values. Unknown labels, alternate spellings/synonyms, duplicate values and empty multi-value fields fail validation. TypeScript types use those same vocabularies. Era is derived from the sourced year; it is not a second editable release date. Free-form recommendation tags are not Game DNA.

All 100 editorial records carry explicit pacing, perspective and structure assignments. Perspective can have several recorded views; pacing and structure represent a primary editorial characterization rather than every scene or mode. These classifications are GAMEBOX judgements, separate from verified factual metadata.

## New vocabulary definitions

- Pacing: **Slow** favors deliberate exploration/planning; **Balanced** alternates deliberate and active play; **Fast** emphasizes sustained reflexes or time pressure.
- Perspective: **First-person**, **Third-person**, **Fixed-camera** (predetermined scene views), **Isometric** (oblique overhead), **Top-down**, **Side-view**. Multiple entries indicate supported primary viewpoints, not a synonym list.
- Structure: **Linear** follows a staged main route; **Hub-based** returns to central areas; **Open world** allows free regional exploration; **Interconnected** emphasizes a connected network of revisitable spaces; **Mission-based** separates objectives into missions; **Run-based** repeats bounded attempts; **Sandbox** emphasizes self-directed systems/goals.

## Ranking contract

`lib/ranking.ts` exports `rankGames`, `scoreGame`, `intentFromFilters`, `compareRankedGames` and centrally configurable `rankingWeights`. Callers can pass a multi-value DNA intent for future similarity use. Source games, records and intent arrays remain untouched.

Search and platform are mandatory candidate constraints. DNA values are preferences: candidates need at least one requested DNA value, and partial matches remain visible. With no intent, every game is browsable with `hasIntent: false`, a numerical zero match score, no factors and no displayed percentage. No search match, no eligible platform or zero DNA overlap produces an empty, resettable result set.

For each selected dimension, coverage is `matched requested values / requested values`. Its contribution is `weight * coverage`. Search strength is 1 for an exact title, 0.9 for a title substring, 0.7 for development/publishing credits and 0.5 for DNA/keyword matches; these constants live in the shared `lib/search.ts`. Platform coverage is 1 or 0. Unselected dimensions do not contribute to numerator or denominator.

`rawMatchScore = 100 * sum(contributions) / sum(active weights)`; `totalMatchScore` rounds this to one decimal for display. It is preference coverage, **not a probability, objective quality rating or promise that a player will enjoy the game**. Breakdown factors include requested values, matched values, weight, strength, contribution and evidence. Missing preferences remain available separately.

Default positive weights: mood 20, gameplay 20, genre 12, pacing 12, perspective 8, structure 12, difficulty 6, era 5, query 24, platform 8. Non-finite or non-positive custom weights are rejected. Gamebox Score is never a scoring factor.

Ordering first compares the unrounded match score. A chosen tie sort can compare title or year; otherwise Gamebox Score breaks relevance ties, then normalized title, stable slug and ID. String comparisons use code-point order, independent of the runtime locale. Even choosing Gamebox Score in Finder cannot override relevance. The exact-match database remains a strict archive; Finder uses ranked preferences.

Explanations come directly from nonzero scoring factors. They name actual matched canonical values, query evidence and listed platform evidence. They never infer a requested value that was not recorded or claim an unmatched preference. Game detail shows all eight DNA dimensions for inspection.

## Validation

`npm run validate:data` checks all records against the registry. `npm test` runs the existing discovery regressions plus exact versus partial ranking, multiple matched dimensions, raw-score isolation, custom weights, factors/explanation accuracy, deterministic ordering independent of input order, source/intent immutability, invalid synonyms/duplicates, new URL parameters, no-filter and empty-result states.

Browser evidence: Psychological + Puzzle + Slow places Rule of Rose (Gamebox 88, 100% match) above Silent Hill 3 (Gamebox 94, 76.9% match); Silent Hill 3 explicitly lists Slow as unmatched. New DNA URL values and the explicit Gamebox tie sort survive refresh/back/forward. Reset clears every query parameter and restores 100 browse results without percentage badges.
