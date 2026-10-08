require('./load-ts.cjs');
const fs=require('node:fs');const path=require('node:path');
const {games}=require('../data/games.ts');
const {discoveryJourney,matchConfidence,displaySimilarity}=require('../lib/discovery-experience.ts');
const slugs=['silent-hill-2','dark-souls','deus-ex','vagrant-story','killer7'];
let report='# Discovery Experience 1.0 — actual regression cases\n\nSemantic model and 100 records are unchanged from Sprint 2.5. Modes are deterministic selectors on its scores. Hidden Gem ratings are provisional editorial signals.\n';
for(const slug of slugs){const game=games.find(g=>g.slug===slug),j=discoveryJourney(game,games);report+=`\n## ${game.title}\n\n`;
 for(const [name,pick] of [['BEST MATCH',j.bestMatch],['HIDDEN GEM',j.hiddenGem],['SURPRISE ME',j.surpriseMe]]){
  const line=pick?`${name}: ${pick.match.game.title} — ${displaySimilarity(pick.match.rawSimilarity)}% / ${matchConfidence(pick.match.rawSimilarity)}`:`${name}: no eligible candidate`;
  report+=line+'\n\n'+(pick?pick.reason+'\n\n'+pick.match.explanation:'No candidate clears this mode’s relevance and evidence requirements.')+'\n\n';console.log(game.title+' / '+line);
 }if(j.honesty)report+='Library confidence notice: '+j.honesty+'\n';
}
const counts={};for(const g of games){const label=matchConfidence(discoveryJourney(g,games).bestMatch.match.rawSimilarity);counts[label]=(counts[label]||0)+1;}
report+='\n## Confidence calibration\n\nBest-match bands across 100 source games: '+JSON.stringify(counts)+'. Suggested thresholds retained. Labels use rounded display percentages so a displayed 65% never says GOOD MATCH. They describe overlap strength, not calibrated enjoyment probabilities.\n';
console.log(counts);fs.writeFileSync(path.join(__dirname,'../docs/discovery-experience-regression.md'),report);
