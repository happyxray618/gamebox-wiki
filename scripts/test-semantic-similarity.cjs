require('./load-ts.cjs');
const assert=require('node:assert/strict');
const {games}=require('../data/games.ts');
const {dnaVocabulary,validateGameDNA}=require('../lib/game-dna.ts');
const {buildDistinctiveness,datasetDistinctiveness,traitDistinctiveness}=require('../lib/distinctiveness.ts');
const {compareDNA,recommendSimilarGames,similarityWeights,semanticGroups}=require('../lib/similarity.ts');
const {parseCatalogParams,catalogQuery,emptyFilters,filterGames}=require('../lib/discovery.ts');
const snapshot=JSON.stringify(games);
assert.ok(dnaVocabulary.experience.length>=10 && dnaVocabulary.experience.length<=15);
assert.deepEqual(buildDistinctiveness(games),buildDistinctiveness(games.slice().reverse()));
assert.ok(Object.isFrozen(datasetDistinctiveness.frequencies.experience));
assert.ok(traitDistinctiveness('gameplay','Combat')<traitDistinctiveness('gameplay','Reflexes'));
assert.ok(traitDistinctiveness('mood','Dark')<traitDistinctiveness('mood','Surreal'));
assert.ok(traitDistinctiveness('experience','Narrative-driven')<traitDistinctiveness('experience','Experimental'));
const dimensions=Object.values(semanticGroups).flat();
assert.deepEqual(new Set(dimensions),new Set(Object.keys(dnaVocabulary)));
assert.equal(new Set(dimensions).size,dimensions.length);
const total=group=>semanticGroups[group].reduce((sum,dimension)=>sum+similarityWeights[dimension],0);
assert.ok(total('identity')>total('interaction') && total('identity')>total('context'));

const seed=games[0];
const source={...seed,id:2000,slug:'semantic-source',experience:['Experimental'],mood:['Surreal'],genres:['Adventure'],gameplay:['Combat','Exploration','Puzzle'],pacing:'Balanced'};
const meaningful={...source,id:2001,slug:'meaningful',genres:['RPG'],gameplay:['Farming'],pacing:'Slow',structure:'Sandbox',perspective:['Top-down'],difficulty:'Easy',year:2022};
const generic={...source,id:2002,slug:'generic',experience:['Arcade flow'],mood:['Cozy']};
assert.ok(compareDNA(source,meaningful).rawSimilarity>compareDNA(source,generic).rawSimilarity,'distinctive experience/atmosphere must beat generic mechanics/context');
const explanation=compareDNA(source,meaningful);
assert.ok(['experience','mood'].includes(explanation.strongestSharedDNA[0].dimension));
assert.ok(explanation.strongestSharedDNA.some(factor=>factor.dimension==='experience'));
assert.ok(explanation.explanation.includes('Experimental')&&explanation.explanation.includes('Surreal'));
assert.ok(!explanation.explanation.includes('Combat')&&!explanation.explanation.includes('Balanced'));
assert.equal(compareDNA(source,meaningful).rawSimilarity,compareDNA(meaningful,source).rawSimilarity);
const reordered={...source,gameplay:source.gameplay.slice().reverse()};
assert.equal(compareDNA(source,generic).rawSimilarity,compareDNA(reordered,generic).rawSimilarity);
assert.deepEqual(compareDNA(source,generic).breakdown,compareDNA(reordered,generic).breakdown);
for(const bad of [[],['Experimental','Experimental'],['experimental'],['Surreal']]) assert.ok(validateGameDNA({...seed,experience:bad},seed.year).length);
const filters={...emptyFilters,experience:'Experimental'};
assert.deepEqual(parseCatalogParams(new URLSearchParams(catalogQuery(filters))).filters,filters);
assert.equal(parseCatalogParams(new URLSearchParams('experience=surreal')).filters.experience,'');
assert.ok(filterGames(games,filters).every(game=>game.experience.includes('Experimental')));

// Product regressions test category coherence and important retained neighbors, not a frozen exact list.
const top=slug=>recommendSimilarGames(games.find(game=>game.slug===slug),games,5);
assert.equal(top('dark-souls')[0].game.slug,'demons-souls');
assert.equal(top('vagrant-story')[0].game.slug,'dark-souls');
assert.ok(top('silent-hill-2').every(match=>match.game.experience.includes('Survival tension')));
assert.ok(top('deus-ex').every(match=>match.game.experience.includes('Immersive simulation')));
assert.ok(top('deus-ex').some(match=>match.game.slug==='prey-2017'));
assert.ok(top('deus-ex').some(match=>match.game.slug==='arx-fatalis'));
assert.ok(top('killer7').every(match=>match.game.experience.includes('Experimental')));
assert.ok(top('killer7').some(match=>match.game.slug==='metal-gear-solid-2'));
for(const slug of ['silent-hill-2','dark-souls','deus-ex','vagrant-story','killer7']) {
  const game=games.find(game=>game.slug===slug);
  assert.deepEqual(recommendSimilarGames(game,games,5),recommendSimilarGames(game,games.slice().reverse(),5));
}
assert.equal(JSON.stringify(games),snapshot);
console.log('PASS: controlled Experience, corpus IDF, semantic groups, distinctive identity over generic mechanics, truthful explanations, URL integration and five product regressions');
