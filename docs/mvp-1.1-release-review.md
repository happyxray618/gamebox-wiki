# GAMEBOX.WIKI — Discovery MVP 1.1 Release Candidate 1

Reviewed 2026-10-08. Target: Vercel, canonical origin **https://gamebox.wiki**, Node 24.x. **Release decision: HOLD public launch** until owner privacy approval and actual Vercel configuration verification are complete. Engineering preparation is complete; no deployment, DNS change, provider enablement or similarity retuning was performed.

## Release gates

PASS below means the stated local scope passed; it does not imply an unperformed deployment passed.

| Area | Result | Evidence / scope |
|---|---|---|
| Production origin / environment | PASS | Fixed production-origin validation; HTTPS contact validation; complete inventory and Vercel instructions in [deployment review](vercel-production-readiness.md) |
| Metadata / canonical / sharing | PASS | All 332 indexable pages have correct formal canonical and OG URL, description, same-origin OG image and policy navigation. Added generated 1200×630 OG image and explicit image inheritance on child pages; Finder queries canonicalize to /finder |
| Sitemap / robots | PASS | Exactly 332 expected formal URLs. Production robots advertises formal sitemap. Local Vercel Preview simulation preserves formal canonical and excludes indexing via HTML and X-Robots-Tag; Preview robots omits sitemap advertisement |
| Valid / invalid routes | PASS | All sitemap pages HTTP 200; invalid game, Games Like, discovery and retro slugs HTTP 404 with noindex. Invalid Finder parameters stay safe and usable |
| Navigation / internal links | PASS | Shared public navigation and policy links; 450 internal links/anchors checked |
| Mobile / browser / hydration | PASS | 15 representative routes at both 320px and 390px: no document horizontal overflow, missing headings or policy links. No browser console errors/warnings or hydration errors observed. Finder select, refresh, back and Reset restore/clear UI and URL correctly |
| Factual evidence | PASS | 100 joins pass validation; source revision, title, extracted developers/publishers, year and platform evidence checked against existing audit. This verifies existing traceability, not a fresh historical re-research |
| Editorial / recommendation trust | PASS | Shared disclosure, Finder copy, recommendation copy and Data Policy distinguish factual metadata, provisional editorial Game DNA/scores, and algorithmic preference/similarity assessments. Percentages are not probabilities of enjoyment or objective quality; confidence indicates overlap strength |
| Discovery coverage | PASS | Reproducible graph/frequency report generated without adjusting data, semantic weights or ranking |
| Measurement readiness | PASS | Provider-independent [launch measurement plan](launch-measurement-plan.md) maps every requested question to future events/payloads; current event contract retained. No collector/provider enabled |
| About / Data Policy | PASS | Public routes available and linked throughout the product |
| Contact | PASS | Owner approved service@gamebox.wiki; Contact and Privacy expose a mailto link. Mailbox delivery has not been tested |
| Privacy approval | FAIL | Draft accurately describes current app; owner must confirm Vercel plan, logging/retention, integrations, then approve disclosures or seek applicable legal review |
| Representative performance | PASS | 11 production-build routes and referenced scripts/styles load successfully; local payload/runtime sanity checked. Remote performance gate remains unverified |
| Vercel project / DNS / TLS / real runtime | FAIL / UNVERIFIED | No deployment authorized. Dashboard environment, Node setting, primary/alternate domains, DNS, TLS, redirects, Preview protection and actual remote responses must be verified later |
| validate:data / test / lint / build | PASS | All four commands passed on final code; 338 generated static entries. Production build restored after Preview test |

## Verification record

`npm run validate:data`, `npm test`, `npm run lint`, `npm run build`, `npm run check:links`, and `npm run audit:performance` passed. Tests include URL state safety, controlled taxonomy, ranking/similarity determinism, score isolation, immutability, discovery eligibility/confidence and origin/contact validation. Production build used NEXT_PUBLIC_SITE_URL=https://gamebox.wiki and VERCEL_ENV=production; Preview build used the same origin with VERCEL_ENV=preview.

Preview artifact checks inspected generated Home/Finder HTML noindex/canonical, robots body and routes-manifest X-Robots-Tag. Production HTTP audit checked every sitemap page, OG PNG, robots, query canonical, invalid-route status and noindex. Browser checks covered Home, Games, Finder, Game Detail, Games Like, Retro, Retro platform, each discovery landing family and all four public information pages. OG image was also visually inspected.

No factual/editorial records, semantic similarity implementation or discovery intent weights were changed. Corpus SHA-256 (combined facts/editorial bytes): `be7b7eb41e1085132dfafc57d734ce4c35e57d6301d99951fe3299ad5deae8b3`.

## Blockers and non-blocking issues

Contact blocker resolved: owner supplied service@gamebox.wiki. It is the application default; SITE_CONTACT_URL remains an optional override. Mailbox provisioning/delivery requires owner verification.
2. Owner must review actual hosting data handling and complete the draft Privacy notice before public launch. No legal compliance assertion is made.
3. Actual Vercel/domain/runtime acceptance remains pending a separate deployment authorization. Local success cannot certify those settings.

Non-blocking: analytics collection remains deliberately absent, so launch behavior will be unmeasured until an approved provider/collector is implemented. Fresh next/font builds need Google Fonts network access; fonts are bundled for runtime. Finder/Home/Games ship the curated dataset in client bundles. Local invalid dynamic-slug probes produced Next internal NoFallbackError log entries while correctly returning 404/noindex; browser console checks were clean. Recheck remote error logging on Preview before promotion; escalate if real valid requests fail or logs become operationally noisy.

## Discovery Coverage summary

See [full frequency and game report](discovery-coverage.md) and [machine-readable graph](discovery-coverage.json). Definitions: GOOD edge uses whole-number displayed similarity ≥50; sparse = 0–3 games, overrepresented = ≥30% of the library. These are expansion signals, not truth/quality claims.

- 100 nodes, 524 undirected GOOD-or-stronger edges, 13 components; sizes 30, 23, 15, 12, 7, 4, 3 and six singleton nodes.
- No GOOD-or-stronger neighbor: **Shadow Tower, System Shock 2, Killer7, Shadow of the Colossus, Metal Gear Solid 2: Sons of Liberty, Stardew Valley**.
- No eligible Hidden Gem: **Demon's Souls, Killer7, Ico, Shenmue, Half-Life, Half-Life 2, S.T.A.L.K.E.R.: Shadow of Chernobyl, Metro 2033, The Legend of Zelda: Ocarina of Time, The Legend of Zelda: The Wind Waker, Okami, Beyond Good & Evil, Stardew Valley**. Eligibility includes existing relevance/distinctiveness/Hidden Gem gates; absence is honest coverage, not a fallback bug.
- Particularly isolated: **Killer7** strongest neighbor 32% (LIMITED); **Stardew Valley** 20% (LIMITED). Do not overstate either or add game-specific exceptions.
- Sparse Experience: **Systemic creativity (2)**. Sparse Mood: 16 values; sparse Gameplay: 10 values. Full names/counts appear in the coverage report.
- Most common values: **Exploration 89, Medium difficulty 70, Third-person 52, Narrative-driven 50, Slow 50**. These and other values at ≥30% are expansion-balance signals. Adding scarce identities/experiences is preferable to filling only already-dense clusters.

## Known limits and performance

Factual evidence records preserve existing source/revision verification, with the documented Steam developer evidence exception. Platform lists are historical metadata, not current purchase/play availability; inherited platform aliases remain a future normalization task. Editorial profiles/scores are provisional and are not individual professional reviews, popularity metrics or verified player satisfaction. Dataset frequency affects distinctiveness, so adding games may change semantic results even without changing weights. No expansion or model changes were made to hide these limits.

[Performance report](production-performance.md): 11 local production routes, one warmup plus median of three full-response fetches. Warm responses 1.46–5.12 ms; HTML gzip estimates 3.6–24.9 KiB, referenced JS gzip estimates 173.4–199.2 KiB. Shared bundles are cacheable and totals must not be added across pages. These Windows localhost measurements are not network TTFB, Vercel benchmarks, Lighthouse scores or Core Web Vitals. Mobile checks are viewport/browser checks, not physical-device/network tests.

## Recommended production checklist

1. Resolve the Privacy blocker and verify mailbox delivery. Review About/Data Policy language; retain provisional editorial and algorithmic disclosures.
2. In Vercel, confirm Next.js preset, repository root, Node 24.x, npm ci, lockfile, framework-default output and all four quality gates in the build command. Configure NEXT_PUBLIC_SITE_URL=https://gamebox.wiki for Production and Preview; Optionally set SITE_CONTACT_URL=mailto:service@gamebox.wiki (the application default). Rebuild when either changes. No backend secrets are required.
3. After separate authorization, create/inspect Preview: verify noindex response headers/HTML, formal canonical, assets, invalid-slug 404, server logs and mobile Finder journey. Verify actual integrations/logging/retention against Privacy. Do not promote with unexplained valid-route failures.
4. Verify gamebox.wiki DNS/TLS and primary domain. Redirect alternate production www/vercel.app entrypoints to the confirmed origin using reviewed domain settings. Check Preview protection; do not expose private environment values.
5. After separately authorized production promotion, run CHECK_BASE_URL=https://gamebox.wiki npm run check:links; inspect formal sitemap/robots, canonical query stripping, share image, 404 status/noindex, real console and 320/390 layouts. Confirm production is indexable while Preview remains excluded.
6. Measure cold navigation and real mobile LCP/INP/CLS, cache behavior and delivery errors for Home, Games, Finder, Detail, Games Like, Retro and discovery landings. Monitor weak/no-mode coverage without retuning the model to conceal it.
7. If analytics is later selected, review privacy first and implement the existing event contract plus launch plan. Do not claim measurement exists before collection is enabled. Keep a tested previous Vercel deployment available for owner-approved rollback.

No Supabase, accounts, community, newsletter backend, embeddings, availability feature, monetization, major redesign or 500-game expansion was introduced.
