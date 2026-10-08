# Anonymous recommendation feedback — future contract

`lib/recommendation-feedback.ts` defines the payload type only. No analytics provider, collection endpoint, cookies, accounts, persistent identifier, feedback buttons or event dispatch are implemented in Sprint 3.

## Events

| Name | Future trigger |
|---|---|
| recommendation_impression | Card at least 50% visible for one continuous second; once per exposure |
| recommendation_click | User activates its game detail link, including keyboard activation |
| recommendation_good_match | User explicitly marks this recommendation as a good match |
| recommendation_not_for_me | User explicitly marks this recommendation as not for them |

Do not infer approval from clicks or absence of clicks. Do not emit impressions at static generation or server render. New exposure after navigation can receive a new impressionId; rerenders of the same exposure reuse it.

## Required payload

- `name`, `schemaVersion: 1`, `occurredAt`: event name and UTC ISO-8601 timestamp.
- `impressionId`: ephemeral random per-card-exposure identifier shared by its later click/feedback events. Not a user/session/device identifier; no cross-visit persistence.
- `sourceSlug`, `candidateSlug`: valid canonical game slugs; never identical.
- `surface`: games_like or game_detail.
- `mode`: best_match, hidden_gem, surprise_me, more_dna or similar_games.
- `position`: positive one-based section position, matching visible ordering.
- `similarityRaw`: finite 0–100; `similarityDisplayed`: whole-number presentation; `confidenceLabel`: corresponding band.
- `similarityModelVersion`, `discoveryPolicyVersion`, `datasetVersion`: algorithm/policy versions and a content revision/hash sufficient to reproduce the suggestion, not just a count of records.
- `sharedDNA`: only actually shared canonical dimension/value pairs shown in the explanation.

All four events use the same recommendation snapshot. Later implementation must validate enum values, timestamps, slugs, score bounds, display/band consistency and shared-DNA truthfulness. Deduplicate retry delivery by impressionId + event name; for explicit feedback, allow latest choice to supersede an earlier choice within that exposure rather than double-counting a person.

Do not include names, email, account IDs, IP addresses, browser/device fingerprints, full URLs/query parameters, free-form text or browsing history. Any future delivery system must avoid attaching those fields through transport logs. Aggregated analysis should compare relevance by source, mode, band and dataset version; LIMITED feedback must not be interpreted as feedback on strong matches. Retention, consent and collection deployment remain decisions for a future sprint.
