# Representative production-build performance

Local `next start`, Node 24 on Windows. Median of three warm full-response fetches after one warmup. Gzip sizes are estimates calculated on decoded responses, not measured transfer bytes. This is a payload/runtime sanity audit, not a remote Vercel benchmark, Lighthouse score or Core Web Vitals measurement.

| Page | Warm response ms | HTML gzip KiB | Referenced JS gzip KiB | Scripts |
|---|---:|---:|---:|---:|
| / | 2.91 | 4.7 | 198.0 | 10 |
| /games | 1.46 | 3.6 | 199.2 | 10 |
| /finder | 1.5 | 3.8 | 199.2 | 10 |
| /games/silent-hill-2 | 2.56 | 9.6 | 173.4 | 8 |
| /games-like/killer7 | 2.8 | 10.0 | 173.4 | 8 |
| /retro | 5.12 | 24.9 | 173.4 | 8 |
| /retro/ps1 | 2.23 | 7.4 | 173.4 | 8 |
| /genres/rpg | 2.58 | 11.8 | 173.4 | 8 |
| /platforms/ps2 | 2.46 | 10.1 | 173.4 | 8 |
| /moods/psychological | 1.71 | 5.3 | 173.4 | 8 |
| /gameplay/exploration | 3.88 | 21.0 | 173.4 | 8 |

All sampled HTML/script/style requests returned 200; no third-party runtime scripts/styles. Shared JS appears in each page total and is cacheable, so page totals must not be added as session transfer size. Home/Finder/Games ship the full curated dataset in client code; monitor real mobile interaction and payload after launch. Google fonts are fetched during build by next/font and served locally at runtime. Post-deployment checks should cover cold navigation, LCP, INP, CLS, caching and real mobile network conditions before claiming performance targets.
