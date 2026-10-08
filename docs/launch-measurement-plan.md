# Minimum launch measurement plan — provider independent

No provider or collector is enabled in RC1. Current behavior cannot answer these questions quantitatively yet. The existing anonymous recommendation contract remains the base; measurement implementation, consent/disclosure, retention and provider selection are a later owner-approved change. Vercel hosting is not permission to enable Vercel Web Analytics or Speed Insights automatically.

| Product question | Minimum signals | Report |
|---|---|---|
| Do visitors use Finder? | Canonical page_view for /finder; finder_interaction for a user-initiated filter/search edit/reset | Finder visits and interactions; not unique people |
| Do Finder visitors open game pages? | finder_result_click with game slug/position, then game_detail_view | Finder → detail completion rate |
| Do visitors click Similar Games? | Existing recommendation_impression/click with surface game_detail, mode similar_games | Visible-card CTR and destination views |
| Do visitors use Games Like? | games_like_open and page_view with source slug; incoming path category | Detail → Games Like usage |
| Which intent cards are clicked? | Existing recommendation events with best_match / hidden_gem / surprise_me | Per-mode CTR, band, source and empty-mode counts |
| Which paths deepen journeys? | In-memory journey token; canonical page_view and recommendation links | Detail views after Finder, Similar Games and each mode; multi-step funnels |
| Where are recommendations weak? | impression band, journey_confidence_notice, discovery_mode_unavailable | Sources with LIMITED/PARTIAL exposure, unavailable modes and feedback |

## Minimal extension to the event contract

Keep required fields/versions from `recommendation-feedback-events.md`. Additional events above need UTC timestamp, schema version, canonical surface/path category, current/source/target game slug where applicable, trigger kind, one-based result position where applicable, model/policy/dataset versions and ephemeral journeyId. A journeyId would exist only in tab memory, expire on reload/close and never identify a person across visits. This is a planned contract extension, not a currently emitted payload field.

Finder events may record presence of a query and count of selected dimensions. Do not send query text, full URL/query strings, email, IP, device fingerprint, persistent IDs or free-form feedback. Page paths should be normalized to known routes/slugs. Record unavailable mode as a reason enum: insufficient_similarity, insufficient_distinctive_identity, insufficient_editorial_signal, no_candidates; several reasons may coexist.

Impressions use the contract's visibility rule; route rerenders, static generation and prefetching must not count as visits. Link click and destination view are separate signals; keyboard activation is equivalent. Good/not-for-me feedback requires an explicit future user action. Pair with the same recommendation snapshot so later data edits cannot relabel historical events.

Anonymous tab journeys are incomplete across reloads/tabs and cannot provide unique-user or retention metrics. Start with aggregate visits, exposed-card CTR, depth and low-confidence coverage. Separate confidence bands and never treat LIMITED feedback as evidence about strong matches. Provider/transport implementation must prevent enrichment with IP/full URLs through logs and requires privacy review before activation.

## Launch with collection disabled

The site can launch without product analytics once owner/privacy/contact gates are met. The tradeoff is that only coverage reports and manual testing guide decisions. Document that gap; do not imply the hosting logs answer product funnels. When a provider is chosen, update Privacy, approve retention/consent, validate payload redaction, test the funnel and ship collection as a separate change.
