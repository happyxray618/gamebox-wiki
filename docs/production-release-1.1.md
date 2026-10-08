# GAMEBOX.WIKI — Production Release 1.1

**Decision: RELEASED**, 2026-10-08 (Asia/Shanghai). Explicit owner Production GO received. Discovery MVP 1.1 is publicly served by Vercel at https://gamebox.wiki. No new features, similarity retuning or corpus changes.

## Release identity

- Deployment: `dpl_EVvWcbzzRuHgkMc5KxX3UHvS2sxX`, READY, target production.
- Deployed commit: `76c66728e0507a21d14f2246c8107ee80163b95b` (deployment githubCommitSha confirms it).
- Production URL: [gamebox.wiki](https://gamebox.wiki).
- Immutable deployment URL: https://gamebox-wiki-1rpfaclw6-happyxray618-1549s-projects.vercel.app (Vercel authentication applies to default domains).
- Team: happyxray618-1549s-projects; project: gamebox-wiki / prj_rrQxk5Z9dvsNSVfw34gvLiYjkQj2.
- Source was an archive of the committed tree, excluding owner README edits, local env credentials and caches. Metadata gitDirty reflects the enclosing checkout; it does not mean dirty files were uploaded. Custom releaseCommit metadata accidentally contains older b67010b; use the verified githubCommitSha above as authoritative.

## Before-release checks

Mailbox: owner confirmed a test message to service@gamebox.wiki was received in this session on October 8. Exact send/receive timestamps and headers were not supplied; this is owner-confirmed receipt, not an independently instrumented mail test. No email was sent by the agent.

Production env values were retrieved through Vercel's current individual-env API and verified:

| Variable | Value |
|---|---|
| NEXT_PUBLIC_SITE_URL | https://gamebox.wiki |
| SITE_CONTACT_URL | mailto:service@gamebox.wiki |
| VERCEL_PREVIEW_FEEDBACK_ENABLED | 0 |

Owner interactively confirmed disabling Vercel Web Analytics and Speed Insights, as required by CLI. Their historic IDs remain in project metadata; IDs alone are not used as proof of enablement. Application has no associated SDK imports. Public HTML/script inspection found no Vercel analytics, Speed Insights, Toolbar or Cloudflare Insights collector script. Protected Preview tooling remains separate from public Production.

Privacy finalized in the deployed commit: no GAMEBOX analytics, recommendation feedback, accounts or newsletter collection; Finder URLs/history and hosting requests disclosed; Vercel infrastructure information is acknowledged rather than claiming zero collection. Infrastructure retention is not inferred from runtime-log visibility. Email and external-source data handling are described. [Public Privacy](https://gamebox.wiki/privacy). This is a factual operational notice, not a legal-compliance certification. [Vercel privacy notice](https://vercel.com/legal/privacy-notice).

## Deployment / DNS / TLS

Created explicit Production with --prod --skip-domain. Vercel build passed validate:data, test, lint and build, generating 338 static entries. It was READY before any DNS write. Domain binding occurred after READY; deployment was already current Production when promotion was attempted (409 already current, no rebuild).

Actual authoritative DNS is Cloudflare, not Alibaba DNS: gigi.ns.cloudflare.com / julio.ns.cloudflare.com. Owner logged into Cloudflare and specifically confirmed changing website proxy to DNS only, with direct Vercel delivery/security.

| Record | Before | After |
|---|---|---|
| @ | A 8.134.166.237, Proxied, Auto TTL | CNAME 6da94e4b511ac1e2.vercel-dns-017.com, DNS only, Auto TTL |
| www | A 8.134.166.237, Proxied, Auto TTL | Same Vercel CNAME, DNS only, Auto TTL |

Target came from actual Vercel domain verification, not a universal hardcoded address. Apex is flattened by Cloudflare. Both domains verified configured-correctly by Vercel. Nameservers unchanged. MX mxbiz1.qq.com priority 5, mxbiz2.qq.com priority 10 and existing SPF/DMARC TXT records preserved. Existing SPF contains a self-include and the old server IP; no mail-policy repair was made in this website release. Owner-confirmed inbound receipt does not validate SPF/outbound deliverability.

Primary public domain: gamebox.wiki, no redirect; www.gamebox.wiki redirects 308 to gamebox.wiki. Actual HTTPS request to /games-like/killer7 on www returned Location https://gamebox.wiki/games-like/killer7, preserving path. Canonicals and sitemap use apex throughout.

TLS: Vercel certificates cert_NTcdgwB7AggnAuyhOp5LpRG8 (apex) and cert_5M9jsVNPKzN2IEIRiVY5xZ1O (www), automatically renewing, listed with approximately 90 days remaining at verification. HTTPS requests succeeded with normal certificate validation; no insecure-TLS flags. Initial connection closures occurred before certificate readiness, then cleared; homepage returned 200 Server: Vercel with HSTS, and browser opened normally. Point-in-time DNS resolver checks passed; not a guarantee every recursive resolver has expired old caches.

## Production acceptance

| Check | Result |
|---|---|
| Public apex 200 / HTTPS valid | PASS, actual HTTP and browser access |
| Primary / www 308 | PASS, path preserved |
| Public indexing | PASS, all 332 page HTML checks; sampled headers have no noindex |
| Preview protected / noindex | PASS, retained Preview returns 302 Vercel SSO and X-Robots-Tag: noindex |
| robots / sitemap | PASS, formal sitemap advertised; exact 332 expected formal URLs |
| canonical / OG URL and images | PASS on all 332 pages; OG PNG endpoint passes |
| Invalid routes | PASS, nine invalid routes 404 with HTML noindex; sampled /games/missing verified again |
| Finder URL state | PASS, Experimental → Contemplative; reload retains; back/forward restore; Reset clears URL |
| Games Like / recommendations | PASS, all Games Like pages audited against actual deterministic journey card counts and explanations |
| BEST MATCH click | PASS, Silent Hill 2 → SOMA |
| HIDDEN GEM click | PASS, Silent Hill 2 → Fatal Frame II: Crimson Butterfly |
| SURPRISE ME click | PASS, Silent Hill 2 → Rule of Rose |
| Internal links | PASS, actual https://gamebox.wiki audit: 332 pages / 450 internal links and anchors |
| 320 / 390 widths | PASS, 26 route/width checks, no horizontal overflow |
| Browser console / hydration | PASS, sampled error/warning list empty; no hydration errors observed |
| Runtime errors | PASS, production error-level query over preceding 30 minutes returned zero records |
| Application collection | PASS, no collector code/observed scripts; public newsletter remains coming soon without submission |

Link audit executed with CHECK_BASE_URL=https://gamebox.wiki using scripts/check-links.cjs. It checks actual remote statuses, canonical/OG metadata, shared navigation, exact sitemap membership, discovery journey content, links/anchors, invalid routes and safe Finder parameters. Browser mobile routes: Home, Games, Finder, Silent Hill 2 detail/Games Like, Killer7 Games Like, Retro, genre/platform/mood/gameplay landing pages, Privacy and Contact. See [mobile results](production-evidence/mobile-summary.json), [deployment](production-evidence/deployment.json), [domains](production-evidence/domains.json), [390px screenshot](production-evidence/home-390.jpg).

Browser automation intermittently timed out; unfinished loops were not counted. Individual recommendation clicks were then completed and actual destination headings/URLs confirmed. No product fixes or similarity changes were made to address automation timing.

## Rollback / retained deployments

There was no earlier accepted public Vercel Production release. Retained known-good RC2 Preview: dpl_2gguGYHbJgJUB35yaXc4dSdtkbwf, READY; it remains protected/noindex and is not an instant equivalent of a Production build.

**Production rollback baseline for subsequent releases: dpl_EVvWcbzzRuHgkMc5KxX3UHvS2sxX**, this accepted release. Keep it available; do not delete it after future deployments. For a later serious valid-route/runtime/indexing regression, use vercel rollback with this deployment before feature work and recheck apex/www/indexing. No rollback was required during this release. Do not roll back public traffic to a noindex Preview build.

## Alibaba / remaining limitations

Owner clarified that the Alibaba server is already stopped and need not be retained. No server deletion, cancellation or billing operation was performed. Website DNS no longer references its old IP; the GAMEBOX production domain now serves Vercel, not the old template. Existing email SPF reference is unrelated to website serving and was preserved.

Development toolchain warning remains as recorded in RC2: one braces advisory reported across five dev packages; runtime dependency audit previously had zero findings. No force dependency downgrade. No analytics provider, background feedback collection, new backend or product features added. No field Core Web Vitals, stress or multi-region test; runtime-log result is limited to the queried window. Existing coverage limitations remain visible.

Report/evidence commits after 76c6672 are documentation only and are not part of the deployed application snapshot. Final decision: **RELEASED**, no serious valid-route/runtime/indexing regression found in acceptance.
