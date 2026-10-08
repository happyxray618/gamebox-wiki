# GAMEBOX data policy

`game-facts.json` holds sourced factual metadata. `game-editorial.json` holds GAMEBOX classifications, copy and provisional ratings. `games.ts` joins them by stable slug and exposes the existing flat fields to pages; it also exposes `.facts` and `.editorial`. Exported data is recursively frozen.

Facts are checked against the cited Wikipedia **game** infobox, not the series article. Each source has a URL, access date, source revision and the fields it supports. `verification-audit.json` stores the extracted evidence and normalization results. Return of the Obra Dinn's development credit uses its developer-published Steam listing because the Wikipedia infobox only has a designer credit. Credits and platform headings that need manual normalization are recorded in `scripts/source-overrides.json`.

Verification means **source-backed factual metadata**, not independent archival research or a claim that an entire article is correct. The year is the earliest release listed in the game infobox, across regions. Platform lists reflect the source's listed editions and ports, sometimes including remasters. They are not exhaustive compatibility lists, store availability claims or permission to distribute a game. Current store availability remains unverified. A site's first-party and archival sources can be added per field later.

Mood, gameplay, genres, difficulty, length, recommendation copy and the four scores are editorial judgements. New additions use curated recommendation copy and initial classification profiles; their scores are provisional profile starting points, **not individualized reviews, user ratings or externally verified scores**. Existing 20-game editorial judgements are preserved. `Not assessed` means no playtime estimate has been made. Review these editorial starting points before making claims about score methodology or ranking accuracy.

Optional `sources` and `verification` fields support drafts and later field-by-field checks without breaking the compatibility view. This release requires every published record to have verified factual fields.

## Validation and source maintenance

```powershell
npm run validate:data
npm test
npm run lint
npm run build
```

To re-fetch publicly cited sources and rebuild normalized facts, run `./scripts/fetch-sources.ps1` (its proxy URL is configurable), review the evidence, then `node scripts/compile-data.cjs --reviewed-at YYYY-MM-DD` with the actual review date. HTML stays in ignored `.cache/gamebox`. The public source manifest and audit are versioned. Re-check redirects and evidence before changing verification dates or marking new fields verified; do not treat an HTTP 200 response as proof. The importer deliberately fails on missing factual fields or a missing explicit review date.

`npm run check:links` checks a production server on port 3100, or set `CHECK_BASE_URL` to another local server. It checks every sitemap page, canonical metadata, navigation, internal links and anchors, invalid route 404s, and invalid Finder query handling.

## Game DNA 1.0 / Sprint 1

Pacing, perspective and structure are explicitly assigned to every editorial record. The controlled registry and validation live in `lib/game-dna.ts`; arbitrary aliases or duplicate labels are rejected. Era remains derived from factual release year. Mood, genre, gameplay, difficulty and all three new dimensions are editorial classifications.

The source importer now preserves the current reviewed editorial/DNA records and fails if a matching editorial record is missing; it cannot overwrite DNA with the earlier classification templates. Run validation after any source import.

Finder match percentages are preference coverage, not Gamebox Score or a probability of enjoyment. See [ranking contract](../docs/discovery-ranking-1.0.md) for weights, factors, candidate constraints, tie rules and tests.
