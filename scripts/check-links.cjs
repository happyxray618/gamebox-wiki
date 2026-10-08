require('./load-ts.cjs');
const assert = require('node:assert/strict');
const {parse}=require('next/dist/compiled/node-html-parser');
const {games}=require('../data/games.ts');
const {discoveryPaths}=require('../lib/taxonomy.ts');
const {discoveryJourney}=require('../lib/discovery-experience.ts');
const {siteUrl}=require('../lib/metadata.ts');
const origin=process.env.CHECK_BASE_URL || 'http://localhost:3100';

async function main() {
  const sitemap=await fetch(`${origin}/sitemap.xml`);
  assert.equal(sitemap.status,200);
  const xml=await sitemap.text();
  for(const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) assert.equal(new URL(match[1]).origin,siteUrl,'sitemap origin');
  const paths=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]).pathname);
  const expected=['/','/games','/finder','/retro','/hidden-gems','/about','/data-policy','/privacy','/contact',...games.map(game=>`/games/${game.slug}`),...games.map(game=>`/games-like/${game.slug}`),...['ps1','ps2','dreamcast','xbox','gamecube','arcade'].map(platform=>`/retro/${platform}`),...discoveryPaths()];
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
      assert.ok(canonical && new URL(canonical).pathname===path && new URL(canonical).origin===siteUrl,`${path}: wrong canonical ${canonical}`);
      assert.ok(tree.querySelector('meta[name="description"]')?.getAttribute('content'),`${path}: missing description`);
      assert.equal(new URL(tree.querySelector('meta[property="og:url"]')?.getAttribute('content')).href,new URL(path,siteUrl).href,`${path}: wrong OG URL`);
      assert.equal(new URL(tree.querySelector('meta[property="og:image"]')?.getAttribute('content')).origin,siteUrl,`${path}: wrong OG image origin`);
      assert.ok(!tree.querySelector('meta[name="robots"]')?.getAttribute('content')?.includes('noindex'),`${path}: production page excludes indexing`);
      assert.ok(tree.querySelector('nav[aria-label="Site information"]'),`${path}: missing public policy links`);
      if(discoveryPaths().includes(path)) assert.ok(tree.querySelector('title')?.textContent.includes('Games | GAMEBOX.WIKI'),`${path}: missing discovery metadata`);
      if(path.startsWith('/games-like/')) {
        const slug=path.slice('/games-like/'.length);
        const game=games.find(game=>game.slug===slug);
        assert.ok(tree.querySelector('title')?.textContent.includes(`Games Like ${game.title}`),`${path}: missing Games Like metadata`);
        assert.ok(tree.querySelector(`a[href="/games/${slug}"]`),`${path}: missing source game detail link`);
        const cards=tree.querySelectorAll('article');
        const journey=discoveryJourney(game,games);
        assert.equal(cards.length,journey.more.length+[journey.bestMatch,journey.hiddenGem,journey.surpriseMe].filter(Boolean).length,`${path}: wrong discovery journey count`);
        for(const id of ['best-match','hidden-gem','surprise-me','more-dna']) assert.ok(tree.querySelector(`[id="${id}"]`),`${path}: missing discovery section ${id}`);
        if(journey.honesty) assert.ok(tree.textContent.includes(journey.honesty),`${path}: missing confidence notice`);
        for(const card of cards) {
          assert.ok(!card.querySelector(`a[href="/games/${slug}"]`),`${path}: recommends itself`);
          assert.ok(card.textContent.includes('SIMILAR') && card.textContent.includes("WHY IT'S SIMILAR"),`${path}: missing similarity explanation`);
          assert.ok(/\d+% SIMILAR/.test(card.textContent)&& !/\d+\.\d+% SIMILAR/.test(card.textContent),`${path}: percentages must be whole numbers`);
          assert.ok(card.textContent.includes('MATCH'),`${path}: missing confidence label`);
        }
      }
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
  for(const path of ['/games-like/missing','/games-like/__proto__','/games/missing','/retro/missing','/genres/missing','/platforms/missing','/moods/missing','/gameplay/missing','/retro/__proto__']) {
    const response=await fetch(origin+path);
    assert.equal(response.status,404,`${path}: should be 404`);
    assert.ok(parse(await response.text()).querySelectorAll('meta[name="robots"]').some(meta=>meta.getAttribute('content')?.includes('noindex')),`${path}: missing 404 noindex`);
  }
  const finder=await fetch(`${origin}/finder?genre=invalid&sort=invalid&q=%3Cscript%3E`);
  assert.equal(finder.status,200,'invalid Finder parameters should remain safe and usable');
  const robots=await fetch(`${origin}/robots.txt`);
  assert.equal(robots.status,200);
  assert.ok((await robots.text()).includes(new URL('/sitemap.xml',siteUrl).href),'robots sitemap origin');
  const image=await fetch(origin+'/opengraph-image');assert.equal(image.status,200);assert.ok(image.headers.get('content-type').includes('image/png'));
  const query=await fetch(origin+'/finder?mood=Psychological');assert.ok((await query.text()).includes(new URL('/finder',siteUrl).href),'Finder query canonical');
  console.log(`PASS: ${paths.length} sitemap pages, ${links.size} internal links/anchors, metadata, shared navigation, invalid routes and safe Finder parameters`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
