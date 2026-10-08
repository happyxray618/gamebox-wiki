require('./load-ts.cjs');
const assert=require('node:assert/strict');
const {games}=require('../data/games.ts');
const {rankGames,scoreGame,rankingWeights,intentFromFilters}=require('../lib/ranking.ts');
const {assertGameDNA,validateGameDNA,dnaVocabulary}=require('../lib/game-dna.ts');
const {emptyFilters,parseCatalogParams,catalogQuery}=require('../lib/discovery.ts');

const seed=games.find(game=>game.slug==='silent-hill-2');
function fixture(slug, score, overrides={}) {
  return Object.freeze({...seed,slug,id:slug==='exact'?101:102,title:slug,gameboxScore:score,
    ...overrides});
}
const exact=fixture('exact',1,{mood:['Psychological'],gameplay:['Puzzle'],pacing:'Slow'});
const weaker=fixture('weaker',100,{mood:['Dark'],gameplay:['Puzzle'],pacing:'Fast'});
const noMatch=fixture('no-match',100,{mood:['Cozy'],gameplay:['Farming'],pacing:'Balanced'});
const source=Object.freeze([weaker,noMatch,exact]);
const intent=Object.freeze({dna:Object.freeze({mood:Object.freeze(['Psychological']),gameplay:Object.freeze(['Puzzle']),pacing:Object.freeze(['Slow'])})});
const ranking=rankGames(source,intent);
assert.equal(ranking[0].game.slug,'exact','exact DNA match must outrank weaker high-score game');
assert.equal(ranking[0].totalMatchScore,100);
assert.ok(ranking[1].totalMatchScore<ranking[0].totalMatchScore);
assert.equal(ranking.length,2,'zero DNA overlap must not be recommended');
assert.equal(rankGames(source,intent,undefined,'score')[0].game.slug,'exact','Gamebox tie sort cannot override relevance');
assert.equal(rankGames(source,intent,undefined,'title')[0].game.slug,'exact');

const one=fixture('one-dimension',99,{mood:['Psychological'],gameplay:['Combat'],pacing:'Fast'});
const two=fixture('two-dimensions',1,{mood:['Psychological'],gameplay:['Puzzle'],pacing:'Fast'});
assert.ok(scoreGame(two,intent).totalMatchScore > scoreGame(one,intent).totalMatchScore,'multiple matched dimensions increase relevance');
const score=scoreGame(two,intent);
assert.deepEqual(score.matchedDNA,['Psychological','Puzzle']);
assert.deepEqual(score.unmetPreferences,['Slow']);
assert.ok(score.explanation.includes('Psychological') && score.explanation.includes('Puzzle'));
assert.ok(!score.explanation.includes('Slow pacing'),'explanation must not claim unmatched pacing');
assert.equal(score.factors.find(f=>f.dimension==='pacing').contribution,0);
assert.equal(score.rawMatchScore,score.factors.reduce((sum,f)=>sum+f.contribution,0)/score.factors.reduce((sum,f)=>sum+f.weight,0)*100);
assert.equal(score.factors.some(f=>f.dimension==='gameboxScore'),false);

const fractional=scoreGame(seed,{dna:{perspective:['Third-person','First-person']}});
assert.equal(fractional.totalMatchScore,50,'multi-valued intent earns proportional coverage');
assert.deepEqual(fractional.factors[0].matched,['Third-person']);
const altered=scoreGame(two,intent,{...rankingWeights,pacing:100});
assert.ok(altered.totalMatchScore < score.totalMatchScore,'weights are actually configurable');
assert.throws(()=>rankGames(source,intent,{...rankingWeights,mood:-1}),/Invalid ranking weight/);
assert.throws(()=>rankGames(source,{dna:{pacing:['Slow-paced']}}),/Invalid ranking intent/);
assert.throws(()=>rankGames(source,{dna:{pacing:['Slow','Slow']}}),/Invalid ranking intent/);

const snapshot=JSON.stringify(games), sourceSnapshot=JSON.stringify(source), intentSnapshot=JSON.stringify(intent);
const baseline=JSON.stringify(rankGames(source,intent));
for(let i=0;i<5;i++) assert.equal(JSON.stringify(rankGames(source,intent)),baseline,'ranking must be deterministic');
assert.deepEqual(rankGames([...source].reverse(),intent).map(result=>result.game.slug),ranking.map(result=>result.game.slug),'input order cannot change ranking');
const tieA=fixture('tie-a',50,{title:'Same title'}), tieB=fixture('tie-b',50,{title:'Same title'});
assert.deepEqual(rankGames([tieB,tieA],{dna:{pacing:['Slow']}}).map(result=>result.game.slug),['tie-a','tie-b'],'slug breaks exact ties');
rankGames(games,intent);
assert.equal(JSON.stringify(games),snapshot,'imported records must not change');
assert.equal(JSON.stringify(source),sourceSnapshot);
assert.equal(JSON.stringify(intent),intentSnapshot);

const browse=rankGames(games,intentFromFilters(emptyFilters));
assert.equal(browse.length,100);
assert.ok(browse.every(result=>!result.hasIntent && result.totalMatchScore===0 && !result.factors.length));
assert.ok(browse[0].explanation.includes('Choose Game DNA'));
assert.deepEqual(rankGames(games,{query:'no-such-game-xyz'}),[]);
assert.deepEqual(rankGames(source,{dna:{mood:['Hopeful']}}),[]);
assert.deepEqual(rankGames([],intent),[]);
assert.ok(rankGames(games,{query:'Silent Hill',platform:'PS2'}).every(result=>result.game.title.includes('Silent Hill') && result.game.platforms.includes('PS2')));

for(const [field,bad] of [['pacing','Slow-paced'],['perspective',['First Person']],['structure','Open-world'],['genres',['Shooter','Shooter']],['mood',['cosy']],['gameplay',['Puzzle','Puzzles']],['difficulty','Impossible']]) {
  assert.ok(validateGameDNA({...seed.editorial,[field]:bad}).length,`${field}: noncanonical/duplicate values must fail`);
  assert.throws(()=>assertGameDNA({...seed.editorial,[field]:bad}),/Invalid Game DNA/);
}
assert.ok(validateGameDNA({...seed.editorial,perspective:[]}).length);
assert.ok(validateGameDNA(seed.editorial,2035).length);
assert.ok(validateGameDNA({...seed.editorial,era:'1900s'}).length);
assert.ok(validateGameDNA({...seed.editorial,era:'1990s'},2001).length);
assert.deepEqual(validateGameDNA({...seed.editorial,era:'2000s'},2001),[]);
for(const values of Object.values(dnaVocabulary)) assert.equal(new Set(values).size,values.length);

const dnaFilters={...emptyFilters,pacing:'Slow',perspective:'First-person',structure:'Interconnected'};
assert.deepEqual(parseCatalogParams(new URLSearchParams(catalogQuery(dnaFilters,'match','match')),'match'),{filters:dnaFilters,sort:'match'});
assert.equal(parseCatalogParams(new URLSearchParams('sort=score'),'match').sort,'score');
assert.equal(parseCatalogParams(new URLSearchParams('pacing=Sluggish&perspective=FPS&structure=Open-world'),'match').filters.pacing,'');
assert.equal(catalogQuery(emptyFilters,'match','match'),'');
assert.equal(catalogQuery(emptyFilters,'score','match'),'sort=score');

console.log('PASS: exact/partial/multidimensional relevance, editorial-score isolation, explanations/factors, configurable weights, deterministic ties, immutability, controlled vocabulary, URL DNA, empty and browse states');
