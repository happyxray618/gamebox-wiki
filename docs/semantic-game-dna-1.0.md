# Semantic Game DNA — Sprint 2.5

## Controlled Experience

Experience describes the player's mode of engagement; Mood describes emotional atmosphere. A game can be `Experimental` in presentation while `Playful`, `Unsettling` or `Surreal` in mood. `Surreal` is therefore not an Experience alias. Definitions live with the 13 canonical values in `lib/game-dna.ts`:

| Experience | Engagement |
|---|---|
| Narrative-driven | Following/interpreting a story-led journey |
| Role immersion | Inhabiting and developing a character in a world |
| Player agency | Shaping outcomes through consequential choices/approaches |
| Immersive simulation | Learning/exploiting interacting world systems |
| Survival tension | Sustaining vulnerability and managing threats/scarcity |
| Mastery challenge | Repeated attempts and improvement in execution |
| Discovery-led | Curiosity, knowledge and spatial discovery |
| Strategic planning | Resource tradeoffs and consequential planning |
| Experimental | Unconventional forms of play/narrative presentation |
| Contemplative | Observation, reflection and interpretation |
| Systemic creativity | Self-directed goals and creation through open systems |
| Arcade flow | Sustained rapid performance/feedback rhythm |
| Companion journey | An experience centered on companion relationships |

All 100 editorial records have explicit, reviewed assignments. These are editorial judgments, separate from sourced facts and ratings; they are not inferred from genre, scores or titles at runtime. Missing values, synonyms, duplicates and Mood labels used as Experience fail validation. Finder, URL state, search, game detail and Games Like consume the same registry.

Experience highlights dominant forms of engagement, not every possible activity. For example, resource and equipment allocation justify Strategic planning for System Shock 2 and Shadow Tower; multiple systemic approaches justify Player agency for Arx Fatalis; character/ability development supports Role immersion for Prey. Splinter Cell is classified as Player agency/Mastery challenge, without assuming every stealth game is an immersive simulation. Experimental does not mean low production quality or unusual visual style alone.

## Group weights

| Group | Dimensions / base weights | Total |
|---|---|---:|
| Identity | Experience 32, Mood 22, Genre 10 | 64 |
| Interaction | Gameplay 12, Structure 10, Pacing 6 | 28 |
| Context | Perspective 4, Difficulty 2, Era 2 | 8 |

Groups and weights are centrally frozen/configurable in `lib/similarity.ts`. Finder's intent model remains independent: a requested canonical value still represents explicit intent. No quality rating or game-specific exception enters semantic similarity. Existing franchise groups are used only for the previously documented bounded diversity pass.

## Dataset distinctiveness

`lib/distinctiveness.ts` builds one immutable frequency table from the full 100-game dataset. Each value is counted once per game/dimension. For corpus size N and frequency df:

`idf(value) = 1 + ln((N + 1) / (df + 1))`

Generic values get less evidence mass than rare values. Smoothing keeps frequencies finite, including a canonical value absent from the corpus. Frequency is scoped to its dimension; strings are never conflated across fields.

For each dimension:

1. Weighted Jaccard = sum of IDF for shared values / sum of IDF for union values.
2. Salience = average of the two games' mean IDF in that dimension. Mean, rather than sum, avoids rewarding long tag lists.
3. Effective weight = base weight × salience.
4. Contribution = weighted Jaccard × effective weight.

Similarity = 100 × total contributions / total effective weights. Identical DNA scores 100%; swapping source/candidate gives the same percentage. An exact rare dimension supplies more evidence than an exact generic dimension. Array order is normalized before summation. Candidate subsets, reverse order and source ratings cannot change the corpus statistics. Dataset expansion intentionally changes frequencies and may change rankings; rerun the regression report when editing records.

The API exposes raw/display percentages, dimension base/effective weights, salience, trait frequency/IDF, weighted overlap, group contributions, shared DNA and explanation data. Display is rounded to one decimal, ranking uses unrounded values with deterministic title/slug/id ties. Diversity still preserves #1 and can only promote eligible candidates within 5 points and 90% of the strongest remaining score.

## Explanations

Only actual shared values can appear. When Experience or Mood is shared, the concise explanation uses shared identity dimensions and leaves mechanics/context in the full breakdown. Without shared Experience/Mood, shared genre, interaction and context remain available. Within a shared dimension, the two most distinctive shared values lead; contribution ranks dimensions within the same priority. Experience text comes directly from the central value definitions. This prevents common Combat/Exploration/Balanced values from cluttering an experiential explanation, and never invents an experience match.

## Before → After product review

The captured baseline is `similarity-before-sprint-2.5.json`; it was saved before changing taxonomy, records or scoring. Run `npm run report:similarity` to regenerate the actual current results/explanations in `similarity-after-sprint-2.5.json` and `similarity-before-after-sprint-2.5.md`. Both lists use the page's recommendation API and diversity pass. Percentages across versions are not directly comparable because both the evidence and normalization changed.

- **Silent Hill 2:** narrative/survival/reflection brings SOMA and Silent Hill 3 into Top 5; all five retain Survival tension. Shared Contemplative experience explains SOMA's rise.
- **Dark Souls:** Demon's Souls remains #1, and all five previous neighbors remain in Top 5. Mastery/discovery raises Castlevania while retaining Vagrant Story.
- **Deus Ex:** Thief II remains #1; Arx Fatalis and Prey remain relevant, with Dishonored 2 joining. All five have Immersive simulation; four old neighbors remain. Diversity can place Arx/Prey before an otherwise tied Dishonored sequel.
- **Vagrant Story:** Dark Souls/Demon's Souls remain #1/#2; Shadow Tower and System Shock 2 remain in Top 5. Dino Crisis replaces Fatal Frame II, driven by Strategic planning plus interconnected slow exploration. This is a residual weak cross-genre match deserving editorial review, not proof of perfect semantic recommendations.
- **Killer7:** all five old generic-mechanics neighbors leave Top 5; all five new neighbors share Experimental. Recommendations are still only around 28–32%, reflecting limited overall DNA overlap. The engine does not manufacture a high-confidence match or claim every candidate feels identical.

The regression suite checks meaningful retained neighbors/category coherence as well as synthetic rare-identity vs generic-mechanics comparisons. A passing suite supports reproducibility; it does not replace the actual five-case editorial review above.
