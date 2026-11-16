// Each product exports plain files. No React, Next.js, account or backend required.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'standalone-products/sites.json'), 'utf8'));
function cleanUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.search || url.hash) throw Error('Invalid site URL');
  return url.href.replace(/\/$/, '');
}
function exportProduct(product, output, siteUrl, brandUrl) {
  const source = path.join(root, 'standalone-products', product.source);
  const vars = { '__SITE_URL__': cleanUrl(siteUrl), '__BRAND_URL__': cleanUrl(brandUrl) };
  fs.mkdirSync(output, { recursive: true });
  for (const [template, name] of [['index.template.html', 'index.html'], ['press.template.html', 'press.html']]) {
    let html = fs.readFileSync(path.join(source, template), 'utf8');
    for (const [token, value] of Object.entries(vars)) html = html.replaceAll(token, value);
    if (/__(?:SITE|BRAND)_URL__/.test(html)) throw Error('Unresolved URL token');
    fs.writeFileSync(path.join(output, name), html);
  }
  // Preserve the existing privacy policy wording; localize only its stylesheet/navigation references.
  const privacy = fs.readFileSync(path.join(source, 'privacy-policy.html'), 'utf8')
    .replace('href="../styles.css"', 'href="privacy.css"')
    .replace('href="../index.html">All policies', 'href="./">Game page');
  fs.writeFileSync(path.join(output, 'privacy-policy.html'), privacy);
  fs.writeFileSync(path.join(output, 'privacy.css'), 'body{font:18px/1.7 system-ui,sans-serif;max-width:900px;margin:30px auto;padding:0 22px;color:#243b35;background:#faf7ef}a{color:#245847;overflow-wrap:anywhere}nav{display:flex;gap:20px}h1,h2{line-height:1.25}code{overflow-wrap:anywhere}');
  fs.cpSync(path.join(source, 'images'), path.join(output, 'images'), {recursive:true});
  const base = cleanUrl(siteUrl);
  fs.writeFileSync(path.join(output, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ['', 'press.html'].map(p => `<url><loc>${base}/${p}</loc></url>`).join('') + '</urlset>\n');
  fs.writeFileSync(path.join(output, 'DEPLOYMENT.txt'), `Standalone ${product.name} website\nCanonical: ${base}/\nServe index.html for directory requests. All product assets are included.\nTo move domains, rerun the export command with the new --site-url; no framework is required.\n`);
  console.log('Exported', product.slug, 'to', output);
}
const args = process.argv.slice(2);
if (args.includes('--product')) {
  const get = key => args[args.indexOf(key)+1];
  const product = config.products.find(p => p.slug === get('--product'));
  if (!product || !args.includes('--out') || !args.includes('--site-url')) throw Error('Use --product SLUG --out DIRECTORY --site-url https://domain');
  exportProduct(product, path.resolve(get('--out')), get('--site-url'), args.includes('--brand-url') ? get('--brand-url') : get('--site-url'));
} else {
  for (const p of config.products) exportProduct(p, path.join(root, 'public/nobodyworkshop', p.slug), p.siteUrl, config.brandUrl);
  const brand = cleanUrl(config.brandUrl);
  const links = config.products.map(p => `<li><a href="${cleanUrl(p.siteUrl)}/">${p.name}</a> — Android game, screenshots and FAQ</li>`).join('');
  fs.writeFileSync(path.join(root, 'public/nobodyworkshop/index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NobodyWorkshop — Independent Android Games</title><meta name="description" content="Official independent game pages from NobodyWorkshop. Gameplay, screenshots, FAQs and Google Play links."><link rel="canonical" href="${brand}/"><meta name="robots" content="index,follow"><style>body{font:18px/1.7 system-ui;max-width:850px;margin:60px auto;padding:0 24px;background:#faf7ef;color:#243b35}a{color:#245847}h1{font-size:46px;line-height:1.1}footer{margin-top:45px;font-size:14px}</style></head><body><main><p>Independent Android games</p><h1>NobodyWorkshop</h1><p>Small games from an independent solo developer. Explore each game's own page for gameplay, screenshots, answers and a Google Play download link.</p><ul>${links}</ul><p>Honest feedback is welcome: <a href="mailto:service@gamebox.wiki">service@gamebox.wiki</a></p></main><footer><a href="${brand}/sitemap.xml">Sitemap</a></footer></body></html>`);
  fs.writeFileSync(path.join(root, 'public/nobodyworkshop/sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + [brand+'/', ...config.products.map(p=>cleanUrl(p.siteUrl)+'/')].map(u=>`<url><loc>${u}</loc></url>`).join('') + '</urlset>');
}
