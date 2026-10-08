require('./load-ts.cjs');
const assert=require('node:assert/strict');
const {games}=require('../data/games.ts');
const {compareDNA,rankSimilarGames,recommendSimilarGames,similarityWeights,franchiseGroups}=require('../lib/similarity.ts');
const source=games.find(game=>game.slug==='silent-hill-2');
const snapshot=JSON.stringify(games);
const fixture=(slug,id,overrides={})=>Object.freeze({...source,slug,id,title:slug,...overrides});
const exact=fixture('exact',1001);
const near=fixture('near',1002,{year:1998});
const weak=fixture('weak',1003,{genres:['Simulation'],mood:['Cozy'],gameplay:['Farming'],pacing:'Fast',structure:'Sandbox',perspective:['Top-down'],difficulty:'Easy',year:2022});
assert.equal(compareDNA(source,exact).similarityPercentage,100);
assert.ok(compareDNA(source,near).similarityPercentage>90);
assert.equal(compareDNA(source,weak).similarityPercentage,0);
assert.equal(compareDNA(source,near).rawSimilarity,compareDNA(near,source).rawSimilarity,'comparison is symmetric');
const ranked=rankSimilarGames(source,[weak,near,source,exact]);
assert.deepEqual(ranked.map(match=>match.game.slug),['exact','near']);
for(const field of ['gameboxScore','hiddenGemScore','retroScore','revivalPotential']) {
  const changed={...near,[field]:-10000};
  assert.deepEqual(compareDNA(source,changed).breakdown,compareDNA(source,near).breakdown);
  assert.equal(compareDNA({...source,[field]:9999},changed).rawSimilarity,compareDNA(source,near).rawSimilarity);
  assert.deepEqual(rankSimilarGames(source,[exact,changed]).map(match=>match.game.slug),['exact','near']);
}
const ties=[fixture('zeta',1010),fixture('alpha',1011)];
assert.deepEqual(rankSimilarGames(source,ties).map(match=>match.game.slug),rankSimilarGames(source,ties.slice().reverse()).map(match=>match.game.slug));
const original=rankSimilarGames(source,games).map(match=>[match.game.slug,match.rawSimilarity]);
assert.deepEqual(original,rankSimilarGames(source,games.slice().reverse()).map(match=>[match.game.slug,match.rawSimilarity]));
const recommendations=recommendSimilarGames(source,games);
assert.equal(recommendations.length,6);
assert.equal(recommendations[0].game.slug,original[0][0]);
assert.deepEqual(recommendations,recommendSimilarGames(source,games.slice().reverse()));
assert.ok(!recommendations.some(match=>match.game.slug===source.slug));
const sequel=fixture('silent-hill-3',1012,{difficulty:'Easy'});
const fresh=fixture('fresh',1013,{year:1998,difficulty:'Easy'});
assert.deepEqual(recommendSimilarGames(source,[exact,sequel,fresh],3).map(match=>match.game.slug),['exact','fresh','silent-hill-3'],'close fresh series may precede sequel after #1');
const distant=fixture('distant',1014,{pacing:'Fast'});
assert.deepEqual(recommendSimilarGames(source,[exact,sequel,distant],3).map(match=>match.game.slug),['exact','silent-hill-3','distant'],'diversity cannot replace clearly superior candidate');
for(const match of recommendations) {
  for(const factor of match.breakdown) for(const value of factor.shared) assert.ok(factor.sourceValues.includes(value)&&factor.candidateValues.includes(value));
  for(const factor of match.explanationData) for(const value of factor.values) assert.ok(match.explanation.includes(value));
  assert.ok(Math.abs(match.rawSimilarity-match.breakdown.reduce((sum,f)=>sum+f.contribution,0))<1e-9);
}
assert.equal(JSON.stringify(games),snapshot,'all imported data stays immutable');
assert.deepEqual(recommendSimilarGames(source,[],6),[]);
assert.deepEqual(recommendSimilarGames(source,games,0),[]);
assert.throws(()=>compareDNA(source,exact,{...similarityWeights,mood:NaN}));
assert.ok(compareDNA(source,near,{...similarityWeights,era:30}).rawSimilarity<compareDNA(source,near).rawSimilarity);
for(const group of franchiseGroups) for(const slug of group) assert.ok(games.some(game=>game.slug===slug),`unknown franchise slug ${slug}`);
console.log('PASS: symmetric DNA similarity, exact/weak matches, rating independence, self exclusion, deterministic ordering, immutability and bounded diversity');
