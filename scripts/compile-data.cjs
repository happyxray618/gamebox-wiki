const fs = require('node:fs');
const {parse} = require('next/dist/compiled/node-html-parser');
const manifest = require('./source-manifest.json');
const legacy = JSON.parse(fs.readFileSync(fs.existsSync('.cache/gamebox/legacy.json') ? '.cache/gamebox/legacy.json' : 'data/game-editorial.json','utf8'));
const overrides = require('./source-overrides.json');
const reviewDate = process.argv[process.argv.indexOf('--reviewed-at') + 1];
if (!process.argv.includes('--reviewed-at') || !/^\d{4}-\d{2}-\d{2}$/.test(reviewDate || '')) {
  throw new Error('Review source evidence first, then pass --reviewed-at YYYY-MM-DD. Downloading a page alone does not verify its facts.');
}

const profiles = {
  puzzle: {genres:['Puzzle'],mood:['Thoughtful','Mysterious'],gameplay:['Puzzle','Exploration'],difficulty:'Medium',scores:[94,88,85,75]},
  shooter: {genres:['Action','Shooter'],mood:['Tense','Cinematic'],gameplay:['Combat','Exploration'],difficulty:'Medium',scores:[92,90,80,80]},
  immersive: {genres:['Immersive Sim','RPG'],mood:['Atmospheric','Mysterious'],gameplay:['Exploration','Choices','Combat'],difficulty:'Medium',scores:[93,91,91,82]},
  stealth: {genres:['Stealth','Action'],mood:['Tense','Atmospheric'],gameplay:['Stealth','Infiltration','Exploration'],difficulty:'Hard',scores:[93,91,87,80]},
  rpg: {genres:['RPG'],mood:['Epic','Thoughtful'],gameplay:['Role Playing','Character Building','Exploration'],difficulty:'Medium',scores:[92,92,85,82]},
  narrative: {genres:['RPG','Adventure'],mood:['Melancholic','Thoughtful'],gameplay:['Investigation','Choices','Story'],difficulty:'Medium',scores:[96,85,90,70]},
  horror: {genres:['Horror','Survival Horror'],mood:['Dark','Unsettling'],gameplay:['Exploration','Survival','Puzzle'],difficulty:'Hard',scores:[92,91,89,84]},
  adventure: {genres:['Action Adventure','Adventure'],mood:['Atmospheric','Hopeful'],gameplay:['Exploration','Puzzle','Combat'],difficulty:'Medium',scores:[93,94,84,85]},
  metroidvania: {genres:['Metroidvania','Adventure'],mood:['Isolation','Mysterious'],gameplay:['Exploration','Combat','Discovery'],difficulty:'Hard',scores:[95,94,88,85]},
  platformer: {genres:['Platformer','Action'],mood:['Playful','Hopeful'],gameplay:['Platforming','Discovery'],difficulty:'Medium',scores:[93,94,85,85]},
  arcade: {genres:['Arcade','Action'],mood:['Stylish','Energetic'],gameplay:['Reflexes','Score Attack'],difficulty:'Medium',scores:[90,94,92,87]},
  roguelike: {genres:['Roguelike','Action RPG'],mood:['Energetic','Stylish'],gameplay:['Combat','Character Building','Replayability'],difficulty:'Hard',scores:[95,82,82,70]},
  exploration: {genres:['Adventure','Exploration'],mood:['Quiet','Mysterious'],gameplay:['Exploration','Discovery','Puzzle'],difficulty:'Medium',scores:[95,85,91,70]},
  cozy: {genres:['Simulation','RPG'],mood:['Cozy','Hopeful'],gameplay:['Farming','Life Simulation','Exploration'],difficulty:'Easy',scores:[94,83,80,70]},
};

function clean(html) {
  const tree = parse(html);
  tree.querySelectorAll('style,sup,script,.sortkey').forEach(node=>node.remove());
  return parse(tree.innerHTML.replace(/<br\s*\/?\s*>/gi,'; ').replace(/<\/(?:li|div|b)>/gi,'; ')).textContent
    .replace(/\s+/g,' ').replace(/;\s*;/g,';').replace(/^;|;\s*$/g,'').trim();
}
const platformAliases = {'PlayStation':'PS1','PlayStation 2':'PS2','PlayStation 3':'PS3','PlayStation 4':'PS4','PlayStation 5':'PS5','Microsoft Windows':'PC','Windows':'PC','Nintendo 64':'N64','Super Nintendo Entertainment System':'SNES','Super NES':'SNES','Nintendo Entertainment System':'NES','Nintendo GameCube':'GameCube','Game Boy Advance':'GBA','Game Boy Color':'GBC','Nintendo DS':'DS','Nintendo 3DS':'3DS','Sega Saturn':'Saturn','Sega Dreamcast':'Dreamcast','Xbox Series X/S':'Xbox Series X/S','Xbox Series X and Series S':'Xbox Series X/S'};
Object.assign(platformAliases, {'Mac OS X':'macOS','OS X':'macOS','Google Stadia':'Stadia','Windows PC':'PC'});
function companies(html) {
  const node=parse(html);
  // Collapsible credit tables put the principal credits in a visible heading and port credits underneath.
  const heading=node.querySelector('.collapsible-list')?.childNodes.find(child=>child.rawTagName==='div');
  const text=clean(heading ? heading.innerHTML : html);
  return [...new Set(text.replace(/([a-z])([A-Z]{2,3}:)/g,'$1; $2').split(';').map(s=>s.trim().replace(/^(?:[A-Z]{2,3}(?:\/[A-Z]{2,3})*):\s*/,'').trim()).filter(Boolean))];
}
const facts=[], editorial=[], audit=[];
for (const [index,entry] of manifest.entries()) {
  const path = `.cache/gamebox/${entry.slug}.html`;
  if (!fs.existsSync(path)) throw new Error(`Missing source: ${entry.slug}`);
  const html = fs.readFileSync(path,'utf8');
  const root = parse(html);
  const box = root.querySelector('table.infobox');
  if (!box) throw new Error(`Missing game infobox: ${entry.slug}`);
  const cells = {};
  for (const row of box.querySelectorAll('tr')) {
    const heading = row.querySelector('th');
    const value = row.querySelector('td');
    if (heading && value) cells[clean(heading.innerHTML)] = value.innerHTML;
  }
  const override = overrides[entry.slug];
  const developers = override?.developers || companies(cells.Developer || cells.Developers || cells['Developer(s)'] || '');
  const publishers = override?.publishers || companies(cells.Publisher || cells.Publishers || cells['Publisher(s)'] || '');
  const developer = developers.join('; ');
  const publisher = publishers.join('; ');
  const release = clean(cells.Release || cells['Release date'] || cells['Release dates'] || '');
  const platform = clean(cells.Platforms || cells.Platform || '');
  const years = [...release.matchAll(/\b(?:19|20)\d{2}\b/g)].map(match=>Number(match[0]));
  const year = Math.min(...years);
  if (!developer || !publisher || !platform || !Number.isFinite(year)) throw new Error(`Incomplete source ${entry.slug}: ${JSON.stringify({developer,publisher,release,platform})}`);
  const platformCell=parse(cells.Platforms || cells.Platform || '');
  platformCell.querySelectorAll('sup,style').forEach(node=>node.remove());
  const linkedPlatforms = platformCell.querySelectorAll('a').map(node=>node.textContent.trim()).filter(Boolean);
  const platforms = [...new Set((linkedPlatforms.length ? linkedPlatforms : platform.split(/[;,]/)).map(p=>platformAliases[p.trim()] || p.trim()).filter(Boolean))];
  const fields = ['title','year','developers','publishers','platforms'];
  const revisionId = html.match(/"wgRevisionId":(\d+)/)?.[1];
  const source = {url:entry.url,label:'Wikipedia game infobox',accessedAt:reviewDate,fields:fields.filter(field=>!override?.source?.fields.includes(field)),...(revisionId ? {revisionId} : {})};
  facts.push({id:index+1,slug:entry.slug,title:entry.title,year,developers,publishers,platforms,sources:[source,...(override?.source ? [override.source] : [])],verification:{status:'verified',verifiedAt:reviewDate,fields,notes:'Factual fields cross-checked against the cited game infobox and any additional listed source. Year is the earliest listed release; platform lists include source-listed ports and may include remasters. Principal credits are used where a source separates port credits. Store availability is not verified.'}});
  const old = legacy.find(game=>game.slug===entry.slug);
  if (old) {
    const factKeys = ['id','title','year','developer','publisher','platforms'];
    const copy = Object.fromEntries(Object.entries(old).filter(([key])=>!factKeys.includes(key)));
    editorial.push({...copy,scorePolicy:'provisional-editorial-v1'});
  } else {
    const profile=profiles[entry.profile];
    const [gameboxScore,retroScore,hiddenGemScore,revivalPotential]=profile.scores;
    editorial.push({slug:entry.slug,genres:profile.genres,tags:profile.gameplay,difficulty:profile.difficulty,gameLength:'Not assessed',mood:profile.mood,gameplay:profile.gameplay,gameboxScore,retroScore,hiddenGemScore,revivalPotential,description:entry.pitch,whyPlay:entry.pitch,retroHistory:`First listed release: ${year}. Explore the cited source for the game's release and development history.`,searchKeywords:[entry.title,...profile.genres,...profile.mood],scorePolicy:'provisional-editorial-v1'});
  }
  audit.push({slug:entry.slug,pageTitle:clean(root.querySelector('h1')?.innerHTML || ''),source,extracted:{developer,publisher,release,platform},normalized:{year,platforms},...(override ? {additionalEvidence:override} : {})});
}
fs.writeFileSync('data/game-facts.json',JSON.stringify(facts,null,2)+'\n');
fs.writeFileSync('data/game-editorial.json',JSON.stringify(editorial,null,2)+'\n');
fs.writeFileSync('data/verification-audit.json',JSON.stringify(audit,null,2)+'\n');
console.log(`Compiled ${facts.length} sourced facts and ${editorial.length} editorial records`);
