# GAMEBOX.WIKI — RC2 Preview & Production Readiness

Reviewed 2026-10-08. **Preview technical verification PASS; public Production release HOLD.** Owner Privacy review remains outstanding. No semantic ranking, corpus or discovery feature changes were introduced.

## Verified artifact

- [Final protected Preview](https://gamebox-wiki-msrfc05qc-happyxray618-1549s-projects.vercel.app)
- Deployment `dpl_2gguGYHbJgJUB35yaXc4dSdtkbwf`: READY / STAGED, environment preview (target field null).
- Deployed code `cf3f8dbe63153749294aa30c76a8bcbc144d4cf0`, pushed to origin/codex/rc2-preview. Initial RC1/contact commit f7cc1e86c875417c98bf627fc26b2fc2b176333b.
- Deployment uploaded a Git archive of the code commit. Owner README edits, credentials, local env files and response caches were excluded. No main push or Git integration was performed.
- Canonical origin https://gamebox.wiki; public contact service@gamebox.wiki.

## PASS / FAIL

| Area | Result | Evidence / limit |
|---|---|---|
| Real Preview | PASS | Final Vercel deployment READY/STAGED, preview environment |
| validate:data / test / lint / build | PASS | All four gates passed locally and in final Linux Vercel build; 338 static entries |
| Data and semantic integrity | PASS | 100 records validate; immutability and semantic regression tests pass; corpus/model unchanged |
| HTTP routes | PASS | 332 valid pages return 200; nine invalid route probes return 404 |
| Preview noindex | PASS | Valid pages have HTTP and HTML noindex; invalid probes HTTP noindex; Preview robots omits sitemap advertising |
| Canonical / OG / sitemap | PASS | 332 formal canonical/OG URLs and formal-origin images; exact 332 formal sitemap URLs; image endpoint 200 image/png |
| Internal links | PASS | 450 relative links/anchors checked against valid destinations |
| Mobile / Finder | PASS with scope limit | Original real Preview: 30 route/width checks at 320/390, Finder refresh/back/forward/Reset pass. Final OG-only fix: Games and Killer7 Games Like rechecked at both widths |
| Browser console | PASS in sampled session | No errors/warnings returned, including final Preview; no hydration errors observed |
| Runtime logs | PASS in audit window | Error-level final deployment query after full HTTP crawl returned zero entries |
| Localhost / Linux assumptions | PASS | No application dependence on localhost; actual Node 24 Linux build succeeds |
| Privacy observations | PASS | Actual platform findings recorded below |
| Final public Privacy approval | FAIL / blocker | Notice remains explicit pre-launch draft; owner/legal review outstanding |
| No Production during setup | FAIL, remediated | First deployment unexpectedly promoted by Vercel, subsequently deleted; final Production count 0 |
| DNS scope | PASS | No gamebox.wiki DNS change or custom-domain binding |
| Dependencies | REVIEW | Runtime audit zero; development chain has one advisory reported across five packages |

Machine-readable [HTTP summary](rc2-evidence/http-summary.json). Remote responses were checked by scripts/check-preview-evidence.cjs for status, noindex, canonical, OG, exact sitemap membership, robots, query canonical, links/anchors and invalid routes. Private response caches are not committed. These checks do not establish behavior in every browser or future deployment.

## Actual project configuration

Team happyxray618-1549s-projects (team_XDVRxWcOUjkhqgJrNg0f1yQg), project gamebox-wiki (prj_rrQxk5Z9dvsNSVfw34gvLiYjkQj2), Hobby plan. Next.js preset, Node 24.x, root '.', default output, install npm ci, build npm run validate:data && npm test && npm run lint && npm run build. Final build ran in iad1 on Linux, 2 CPUs / 8 GB.

Preview variables: NEXT_PUBLIC_SITE_URL=https://gamebox.wiki and SITE_CONTACT_URL=mailto:service@gamebox.wiki. VERCEL_ENV is system supplied; NODE_ENV is platform managed. The ignored local .env.local contains CLI-generated OIDC credentials and is not application configuration. Production env scopes have not been independently populated; approved origin/contact defaults exist in code, but Production scopes require review before release.

Git integration is unconnected; branch pushes cannot automatically deploy main. Domain inventory contains only gamebox-wiki.vercel.app. Final API: paused=false, protection=all_except_custom_domains, Production count=0. Preview retains Vercel authentication.

## Findings, fix and browser scope

Original correct Preview revealed Home OG image using the Preview host because of Next.js file-convention metadata override. Replaced app/opengraph-image.tsx with a static app/opengraph-image/route.tsx and explicit root OG image metadata. The endpoint stays /opengraph-image. All 332 final pages now pass formal-origin OG checks. No visual or similarity retuning.

Original Preview dpl_DCkPu94Ze1GzuqvKdygxrAHwofCL received the broad 30-check mobile/Finder interaction pass. Repeating the full loop on final deployment hit browser automation timeouts; those repetitions are not counted as completed. Final targeted Games and Games Like checks at 320/390 measured document widths 305/375 respectively, with no horizontal overflow. [Final 390px screenshot](rc2-evidence/final-preview-killer7-390.jpg). Final sampled console returned an empty list. Final source changes after the broad pass affect OG metadata/handler and audit script only.

## Production incident and containment

The empty-project first CLI deployment used explicit --target preview, but Vercel promoted it to Production and assigned default Vercel aliases. Accidental deployment dpl_BvagZSGNWdDjqKLJiq1zBhPk8cwT was promptly identified. Owner personally paused the project, authorized deletion, then confirmed resume after zero Production deployments were verified. No gamebox.wiki DNS change occurred. Default-domain protection remained enabled.

Fix deployment dpl_5KGL4skaWC3TobRYabZP1getLkFT attempted during pause became BLOCKED and is not the release artifact. After resume, final deployment completed as Preview. Final API again confirms Production count 0. This report records the scope breach rather than claiming setup never created Production.

Owner approved the official CLI Protection Bypass only for this audit. One automation bypass was generated and used without disabling project protection, then revoked via the documented project protection-bypass API with regenerate=false. Final API confirms bypass count 0. No audit credential is included in code/report/screenshots. TLS verification was retained.

## Privacy / data trust

Application code has no accounts, analytics SDK, newsletter backend or recommendation feedback receiver. Finder preferences live in URLs/history and may reach hosting request infrastructure. Feedback remains a future event contract, not a collector. See [measurement plan](launch-measurement-plan.md) and [event contract](recommendation-feedback-events.md).

Actual Preview injects vercel.live/_next-live/feedback/feedback.js. Vercel Preview Toolbar/feedback participates in the protected testing environment; it is separate from GAMEBOX event collection. [Official Toolbar documentation](https://vercel.com/docs/vercel-toolbar).

Project API returns Web Analytics and Speed Insights IDs; hasData=false was observed. No app SDK imports or associated collection scripts were observed. IDs do not prove platform features are disabled. Owner must confirm dashboard settings and intended launch configuration. Log-drain API returned an empty list. Hobby runtime-log visibility is one hour per [Vercel runtime logs](https://vercel.com/docs/logs/runtime); this does not establish retention for all delivery, security, IP, authentication or platform data.

Public /privacy flags owner review and makes no anonymous-hosting/zero-collection or legal-compliance claim. It describes planned Production hosting and remains a draft. Owner/legal review must reconcile hosting, toolbar, analytics, recipients/retention and applicable disclosures before launch. Contact uses approved service@gamebox.wiki; mailbox delivery was not tested and no email was sent.

Facts remain traceable through existing sources/evidence. Editorial scores, Game DNA and algorithmic recommendations remain identified as GAMEBOX assessments. No factual/editorial distinction was relaxed for RC2.

## Dependencies, performance and coverage

Installation reports five high-severity package flags from one development-only braces advisory through eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces. [Primary advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). npm audit --omit=dev reports zero findings. No force-fix or incompatible eslint-config-next downgrade was applied. Review a compatible patched toolchain separately. Dependency deprecation/postinstall warnings in build logs are distinct from browser console warnings.

Representative build baseline remains [performance report](production-performance.md). Actual static delivery and Vercel build pass; no public field Core Web Vitals, load or multi-region performance test was collected.

[Coverage report](discovery-coverage.md) remains unchanged: 524 GOOD-or-better edges, 13 components, six games without a GOOD neighbor, 13 without an eligible Hidden Gem, isolated Killer7/Stardew Valley. Ranking changes were not used to conceal gaps.

## Vercel setup status

Followed [official get-started playbook](https://vercel.com/get-started.md). CLI 63.0.2 authenticated. Official Vercel plugin installed in Codex user scope. MCP configured at https://mcp.vercel.com, OAuth completed; codex mcp list reports enabled/OAuth. Newly installed tools require a new/reloaded agent session. MCP list_teams and documentation-tool checks remain pending tool reload; CLI/API team checks passed separately and are not claimed as MCP verification.

## Recommended production checklist

1. Owner approves final Privacy wording after checking platform analytics/toolbar/logging/data handling; verify contact mailbox delivery.
2. Review development advisory and apply compatible toolchain patch when available; rerun all four gates after dependency changes.
3. Review Production environment scopes and formal origin/contact; keep Preview protected/noindex.
4. Obtain separate explicit Production authorization. Only then configure gamebox.wiki DNS/TLS and deploy Production. RC2 does not authorize those actions.
5. Verify real Production indexability, robots sitemap advertising, canonical/OG, 404, links, mobile/console and logs. Preview noindex success is not a Production indexing test.
6. Resolve the connector account/team access discrepancy described below before relying on MCP for project management. Provider analytics implementation remains outside RC.

## Connector verification after plugin load

The installed Vercel connector tools became available and both read-only calls completed without tool errors. Documentation search returned official Vercel documentation. However, connector list_teams returned an empty team list, while the separately authenticated CLI had verified the deployment team above. Therefore documentation access passes, but connector access to the intended team is not verified. The cause could be account or authorization scope and has not been established. No connector mutation or redeployment was attempted. This supersedes the earlier pending-tool-reload status; CLI deployment evidence remains valid.

See [RC1 release review](mvp-1.1-release-review.md) and [Vercel readiness](vercel-production-readiness.md). RC2 is ready for protected Preview review; public launch remains on hold.
