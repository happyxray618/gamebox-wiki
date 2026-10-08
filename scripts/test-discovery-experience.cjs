require('./load-ts.cjs');
const assert=require('node:assert/strict');
const {games}=require('../data/games.ts');
const {rankSimilarGames}=require('../lib/similarity.ts');
const {discoveryJourney,matchConfidence,displaySimilarity,distinctiveIdentity,discoveryPolicy}=require('../lib/discovery-experience.ts');
for(const [score,label] of [[100,'VERY STRONG MATCH'],[80,'VERY STRONG MATCH'],[79,'STRONG MATCH'],[65,'STRONG MATCH'],[64,'GOOD MATCH'],[50,'GOOD MATCH'],[49,'PARTIAL MATCH'],[35,'PARTIAL MATCH'],[34,'LIMITED MATCH'],[0,'LIMITED MATCH']]) assert.equal(matchConfidence(score),label);
assert.equal(displaySimilarity(64.6),65);assert.equal(matchConfidence(64.6),'STRONG MATCH');
assert.equal(displaySimilarity(NaN),0);assert.equal(displaySimilarity(102),100);
const before=JSON.stringify(games);
for(const source of games) {
 const journey=discoveryJourney(source,games), ranked=rankSimilarGames(source,games);
 assert.equal(journey.bestMatch.match.game.slug,ranked[0].game.slug);
 assert.deepEqual(journey,discoveryJourney(source,games.slice().reverse()));
 const picks=[journey.bestMatch,journey.hiddenGem,journey.surpriseMe].filter(Boolean);
 assert.equal(new Set(picks.map(p=>p.match.game.slug)).size,picks.length);
 assert.ok(![...picks.map(p=>p.match),...journey.more].some(m=>m.game.slug===source.slug));
 assert.ok(!journey.more.some(m=>picks.some(p=>p.match.game.slug===m.game.slug)));
 if(journey.hiddenGem){const m=journey.hiddenGem.match;assert.ok(m.rawSimilarity>=journey.hiddenFloor);assert.ok(m.game.hiddenGemScore>=85);assert.ok(distinctiveIdentity(m).length);}
 if(journey.surpriseMe){const m=journey.surpriseMe.match;assert.ok(m.rawSimilarity>=journey.surpriseFloor);assert.ok(ranked.findIndex(r=>r.game.slug===m.game.slug)>=3);assert.ok(distinctiveIdentity(m).length);}
 if(displaySimilarity(ranked[0].rawSimilarity)<65)assert.ok(journey.honesty);
}
const seed=games[0], unrelated={...seed,id:9999,slug:'unrelated',hiddenGemScore:100,experience:['Arcade flow'],mood:['Cozy'],genres:['Simulation'],gameplay:['Farming'],pacing:'Fast',structure:'Sandbox',perspective:['Top-down'],difficulty:'Easy',year:2022};
assert.equal(discoveryJourney(seed,[unrelated]).hiddenGem,null,'high gem rating cannot override relevance');
assert.equal(discoveryJourney(seed,[]).bestMatch,null);assert.equal(discoveryJourney(seed,[]).surpriseMe,null);
const killer=discoveryJourney(games.find(g=>g.slug==='killer7'),games);
assert.equal(killer.hiddenGem,null,'limited matches do not clear the hidden-gem floor');
assert.ok(killer.honesty.includes('no close match'));
assert.equal(JSON.stringify(games),before);
assert.equal(discoveryPolicy.hiddenMinimum,35);
console.log('PASS: whole-number confidence boundaries, all 100 deterministic journeys, mode separation, relevance gates, empty modes, low-confidence honesty and immutability');
