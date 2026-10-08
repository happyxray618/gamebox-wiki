require('./load-ts.cjs');
const fs=require('node:fs');
const path=require('node:path');
const {games}=require('../data/games.ts');
const {recommendSimilarGames}=require('../lib/similarity.ts');
const before=require('../docs/similarity-before-sprint-2.5.json');
const after=before.map(record=>{
  const game=games.find(game=>game.slug===record.slug);
  return {slug:game.slug,title:game.title,top5:recommendSimilarGames(game,games,5).map(match=>({slug:match.game.slug,title:match.game.title,similarity:match.similarityPercentage,explanation:match.explanation,sharedDNA:match.strongestSharedDNA,diversityAdjusted:match.diversityAdjusted}))};
});
fs.writeFileSync(path.join(__dirname,'../docs/similarity-after-sprint-2.5.json'),JSON.stringify(after,null,2)+'\n');
let markdown='# Sprint 2.5 — Before → After\n\nBefore is the captured Sprint 2 production engine, before any Experience/data changes. After is generated from the current 100-record dataset and semantic engine. Both use `recommendSimilarGames(..., 5)`, including bounded diversity. Percentages belong to different models and are not a common calibrated scale. An asterisk marks diversity reranking.\n';
for(let i=0;i<before.length;i++) {
  markdown+=`\n## ${before[i].title}\n\n| Rank | Before | Similarity | After | Similarity |\n|---|---|---:|---|---:|\n`;
  for(let j=0;j<5;j++) {const b=before[i].top5[j],a=after[i].top5[j];markdown+=`| ${j+1} | ${b.title}${b.diversityAdjusted?' *':''} | ${b.similarity}% | ${a.title}${a.diversityAdjusted?' *':''} | ${a.similarity}% |\n`;}
  markdown+='\nActual explanation for the new first result:\n\n'+after[i].top5[0].explanation+'\n';
}
fs.writeFileSync(path.join(__dirname,'../docs/similarity-before-after-sprint-2.5.md'),markdown);
for(const record of after) console.log(record.title+': '+record.top5.map(match=>match.title+' '+match.similarity+'%'+(match.diversityAdjusted?' *':'')).join(' | '));
