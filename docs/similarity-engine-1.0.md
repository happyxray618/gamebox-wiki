# Similarity Engine 1.0

`lib/similarity.ts` is independent of Finder ranking. Each dimension uses symmetric Jaccard overlap: shared canonical values divided by the union of both games' values. Single-value fields use exact matches. Era is derived from release year. Missing matches contribute zero; all eight dimensions remain in the denominator.

Weights: genre 16, mood 20, gameplay 24, pacing 12, structure 12, perspective 8, difficulty 5, era 3. `similarityWeights` is the central default; callers can supply positive finite weights. Percentage is the weighted mean multiplied by 100, displayed to one decimal. Sorting uses unrounded similarity, lowercase title, slug, then id. No quality rating is read, including for ties.

`compareDNA` exposes percentage, raw score, all dimension scores/weights/contributions, shared DNA, strongest shared dimensions and explanation data. Explanations name only actual intersections. `rankSimilarGames` provides pure relevance order, excludes source id/slug and zero-overlap candidates. All operations work on new arrays.

`recommendSimilarGames` keeps the pure ranking's first candidate. For each subsequent slot, a fresh franchise and nonduplicate DNA profile can move forward only when it is within 5 percentage points of the strongest remaining candidate AND at least 90% of that candidate's score. DNA profiles scoring 95% or more against an already selected recommendation count as near-duplicates. If no fresh eligible candidate exists, the strongest remaining candidate stays next. Diversity never changes the percentage and is disclosed on adjusted cards. This is a bounded reranking, not a strict descending list after the first result.

Franchises use explicit reviewed slug groups in `franchiseGroups`, rather than guessed title prefixes. Ungrouped titles form singleton families. The source franchise starts as seen. New records should be considered for this registry. Family membership is editorial recommendation metadata, not a verified fact or a scoring factor.

Game details show six recommendations. `/games-like/[slug]` shows source DNA, defining dimensions (the five highest configured weights), and twelve recommendations. Both reuse the same cards/engine. All 100 valid routes are static with canonical metadata and sitemap entries; unknown slugs return 404. Cards link to game details; game details link to their own Games Like explanation page.

Tests cover symmetric exact/near/weak matches, independent quality scores, self exclusion, reversed inputs, immutability, configurable weights, actual explanations, and bounded diversity. `check:links` verifies every Games Like URL/canonical, internal link, and invalid-route HTTP 404 against a running server.
