require('./load-ts.cjs');
const assert = require('node:assert/strict');
const {games}=require('../data/games.ts');
const {emptyFilters,filterGames,parseCatalogParams,catalogQuery}=require('../lib/discovery.ts');
const {discoveryKinds,discoveryValues,discoveryGames,discoveryValue,discoveryPaths}=require('../lib/taxonomy.ts');

const filters={...emptyFilters,query:'Silent Hill',platform:'PS2',mood:'Psychological',gameplay:'Puzzle',era:'2000s'};
const parsed=parseCatalogParams(new URLSearchParams(catalogQuery(filters,'oldest')));
assert.deepEqual(parsed,{filters,sort:'oldest'});
assert.deepEqual(filterGames(games,parsed.filters).map(game=>game.slug),['silent-hill-2','silent-hill-3']);
assert.deepEqual(parseCatalogParams(new URLSearchParams('genre=__proto__&platform=unknown&mood=%3Cscript%3E&sort=bad&era=3020s')), {filters:emptyFilters,sort:'score'});
assert.equal(parseCatalogParams(new URLSearchParams('q='+ 'x'.repeat(500))).filters.query.length,200);
assert.equal(parseCatalogParams(new URLSearchParams('genre=Horror&genre=unknown')).filters.genre,'Horror');
assert.equal(catalogQuery(emptyFilters),'');
assert.deepEqual(filterGames(games,{...emptyFilters,query:'no-such-title-xyz'}),[]);
const order = games.map(game=>game.slug);
filterGames(games,emptyFilters).sort((a,b)=>a.year-b.year);
assert.deepEqual(games.map(game=>game.slug),order);
assert.throws(()=>games.sort((a,b)=>a.year-b.year),TypeError);
for (const kind of discoveryKinds) {
  assert.equal(discoveryValue(kind,'not-a-valid-value'),undefined);
  for (const {value,slug} of discoveryValues(kind)) {
    assert.equal(discoveryValue(kind,slug).value,value);
    assert.ok(discoveryGames(kind,value).length>0);
  }
}
assert.equal(new Set(discoveryPaths()).size,discoveryPaths().length);
console.log('PASS: URL round trips, invalid/duplicate/long parameters, reset, compound filtering, immutable sorting and valid discovery values');
