# Portable product websites

Each product owns its source HTML, FAQ, screenshots, press material and privacy copy in its own directory. Generated files in `public/nobodyworkshop/<slug>/` are plain static files, isolated from GAMEBOX React layouts, CSS and backend. Do not add required cross-product assets or a site-wide account/analytics dependency.

`sites.json` is the deployment address configuration. Run `node scripts/build-standalone-products.mjs` after edits. Only generated product files and the NobodyWorkshop entry are written; other GAMEBOX pages are preserved.

Export Winter Atelier as a complete independent site:

    node scripts/build-standalone-products.mjs --product winter-atelier --out D:/reddit/winteratelier-independent-export --site-url https://example.com

Replace example.com with the actually owned destination before publishing. Serve the resulting directory with directory indexes and HTTPS. Canonical, Open Graph, schema URLs, the HTML base and sitemap are generated for that destination; local assets, press and privacy links stay with the product. No npm dependencies are required for export or static hosting. Keep its existing source version under version control.

For a move, verify the exported site at the new domain, then configure explicit redirects from the old product URLs. Do not switch canonical URLs to an unverified destination, remove the old site early, overwrite other products, or claim migration/indexing based only on copying files.

Production integration uses three project-level Vercel rewrites restricted to /nobodyworkshop and its subtree. The independent static origin is happyxray618/nobody-workshop-privacy under nobodyworkshop/. GAMEBOX production deployment dpl_9gtLU6oDsLzKPg4PStGsZhi8wdEo was preserved: its recorded source commit is not available in this repository. Do not redeploy this repository main over the frozen GAMEBOX production version. Export product files manually and publish only the independent origin directory; then verify the mounted URLs. The product HTML base handles slash and no-slash requests.
