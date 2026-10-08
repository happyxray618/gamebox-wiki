require('./load-ts.cjs');
const assert = require('node:assert/strict');
const {parse}=require('next/dist/compiled/node-html-parser');
const {games}=require('../data/games.ts');
const {discoveryPaths}=require('../lib/taxonomy.ts');
const origin=process.env.CHECK_BASE_URL || 'http://localhost:3100';

async function main() {
  const sitemap=await fetch(`${origin}/sitemap.xml`);
  assert.equal(sitemap.status,200);
  const xml=await sitemap.text();
  const paths=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]).pathname);
  const expected=['/','/games','/finder','/retro','/hidden-gems',...games.map(game=>`/games/${game.slug}`),...['ps1','ps2','dreamcast','xbox','gamecube','arcade'].map(platform=>`/retro/${platform}`),...discoveryPaths()];
  assert.deepEqual(new Set(paths),new Set(expected),'sitemap does not match every indexable page');
  const checked=new Map();
  const links=new Set();
  let offset=0;
  async function worker() {
    while(offset<paths.length) {
      const path=paths[offset++];
      const response=await fetch(new URL(path,origin));
      assert.equal(response.status,200,`${path}: HTTP ${response.status}`);
      const html=await response.text();
      const tree=parse(html);
      checked.set(path,tree);
      assert.ok(tree.querySelector('h1'),`${path}: missing page heading`);
      assert.ok(tree.querySelector('nav[aria-label="Main navigation"]'),`${path}: missing shared navigation`);
      const canonical=tree.querySelector('link[rel="canonical"]')?.getAttribute('href');
      assert.ok(canonical && new URL(canonical).pathname===path,`${path}: wrong canonical ${canonical}`);
      if(discoveryPaths().includes(path)) assert.ok(tree.querySelector('title')?.textContent.includes('Games | GAMEBOX.WIKI'),`${path}: missing discovery metadata`);
      for(const anchor of tree.querySelectorAll('a')) {
        const href=anchor.getAttribute('href');
        if(!href) continue;
        const url=new URL(href,origin);
        if(url.origin===origin) links.add(url.pathname+url.search+url.hash);
      }
    }
  }
  await Promise.all(Array.from({length:4},worker));
  for(const href of links) {
    const url=new URL(href,origin);
    if(!checked.has(url.pathname)) {
      const response=await fetch(url);
      assert.equal(response.status,200,`Broken internal link: ${href}`);
      checked.set(url.pathname,parse(await response.text()));
    }
    if(url.hash) assert.ok(checked.get(url.pathname).querySelector(`[id="${decodeURIComponent(url.hash.slice(1))}"]`),`Broken anchor: ${href}`);
  }
  for(const path of ['/games/missing','/retro/missing','/genres/missing','/platforms/missing','/moods/missing','/gameplay/missing','/retro/__proto__']) assert.equal((await fetch(origin+path)).status,404,`${path}: should be 404`);
  const finder=await fetch(`${origin}/finder?genre=invalid&sort=invalid&q=%3Cscript%3E`);
  assert.equal(finder.status,200,'invalid Finder parameters should remain safe and usable');
  const robots=await fetch(`${origin}/robots.txt`);
  assert.equal(robots.status,200);
  console.log(`PASS: ${paths.length} sitemap pages, ${links.size} internal links/anchors, metadata, shared navigation, invalid routes and safe Finder parameters`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
