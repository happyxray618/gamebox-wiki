require('./load-ts.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {parse}=require('next/dist/compiled/node-html-parser');
const {games}=require('../data/games.ts');
const {discoveryPaths}=require('../lib/taxonomy.ts');
const records=JSON.parse(fs.readFileSync('.cache/rc2-http-responses.json','utf8'));
const byPath=new Map(records.map(r=>[r.path,r]));
const origin='https://gamebox.wiki';
const xml=byPath.get('/sitemap.xml').body;
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]));
for(const u of urls)assert.equal(u.origin,origin);
const expected=['/','/games','/finder','/retro','/hidden-gems','/about','/data-policy','/privacy','/contact',...games.map(g=>`/games/${g.slug}`),...games.map(g=>`/games-like/${g.slug}`),...['ps1','ps2','dreamcast','xbox','gamecube','arcade'].map(p=>`/retro/${p}`),...discoveryPaths()];
assert.deepEqual(new Set(urls.map(u=>u.pathname)),new Set(expected));
const trees=new Map(),links=new Set();
for(const path of expected){
  const r=byPath.get(path);assert.equal(r.status,200,path);assert.ok(String(r.robots).includes('noindex'),`${path}: HTTP noindex`);
  const t=parse(r.body);trees.set(path,t);
  assert.ok(t.querySelector('h1'),path);
  assert.equal(new URL(t.querySelector('link[rel="canonical"]')?.getAttribute('href')).href,new URL(path,origin).href,path);
  assert.equal(new URL(t.querySelector('meta[property="og:url"]')?.getAttribute('content')).href,new URL(path,origin).href,path);
  assert.equal(new URL(t.querySelector('meta[property="og:image"]')?.getAttribute('content')).origin,origin,path);
  assert.ok(t.querySelectorAll('meta[name="robots"]').some(m=>m.getAttribute('content')?.includes('noindex')),path);
  assert.ok(t.querySelector('nav[aria-label="Site information"]'),path);
  for(const a of t.querySelectorAll('a')){const href=a.getAttribute('href');if(href?.startsWith('/'))links.add(href);}
}
for(const href of links){const u=new URL(href,origin);assert.ok(trees.has(u.pathname),`unverified internal destination ${href}`);if(u.hash)assert.ok(trees.get(u.pathname).querySelector(`[id="${decodeURIComponent(u.hash.slice(1))}"]`),href);}
for(const r of records.filter(r=>/missing|__proto__/.test(r.path))){assert.equal(r.status,404,r.path);assert.ok(String(r.robots).includes('noindex'),r.path);}
assert.ok(!byPath.get('/robots.txt').body.includes('Sitemap:'));
assert.equal(new URL(parse(byPath.get('/finder?experience=Experimental').body).querySelector('link[rel="canonical"]').getAttribute('href')).href,new URL('/finder',origin).href);
assert.ok(process.env.RC2_DEPLOYMENT_ID,'set RC2_DEPLOYMENT_ID to the audited deployment');
const summary={deployment:process.env.RC2_DEPLOYMENT_ID,pages:expected.length,internalLinks:links.size,invalidRoutes:records.filter(r=>/missing|__proto__/.test(r.path)).length,checks:'HTTP status/noindex, canonical, OG, sitemap, robots, internal links/anchors and query canonical PASS'};
fs.mkdirSync('docs/rc2-evidence',{recursive:true});fs.writeFileSync('docs/rc2-evidence/http-summary.json',JSON.stringify(summary,null,2)+'\n');console.log(summary);
