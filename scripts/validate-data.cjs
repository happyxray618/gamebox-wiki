require('./load-ts.cjs');
const assert = require('node:assert/strict');
const { games, gameFacts, gameEditorial } = require('../data/games.ts');
const { discoveryKinds, discoveryValues, slugify } = require('../lib/taxonomy.ts');
const audit = require('../data/verification-audit.json');

assert.equal(games.length, 100, 'Discovery MVP must have exactly 100 games');
for (const [name, values] of [['IDs', games.map(g=>g.id)], ['slugs',games.map(g=>g.slug)], ['titles',games.map(g=>g.title)]]) {
  assert.equal(new Set(values).size,100,`Duplicate ${name}`);
}
assert.equal(gameFacts.length,100);
assert.equal(gameEditorial.length,100);
assert.equal(audit.length,100);
const requiredStrings = ['title','developer','publisher','difficulty','gameLength','description','whyPlay','retroHistory'];
const arrays = ['platforms','genres','tags','mood','gameplay','searchKeywords'];
for (const game of games) {
  assert.match(game.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  for (const key of requiredStrings) assert.ok(typeof game[key] === 'string' && game[key].trim(),`${game.slug}: ${key}`);
  assert.ok(Number.isInteger(game.year) && game.year >= 1970 && game.year <= 2026,`${game.slug}: year`);
  for (const key of arrays) {
    assert.ok(Array.isArray(game[key]) && game[key].length,`${game.slug}: ${key}`);
    assert.ok(game[key].every(value=>typeof value==='string' && value.trim()),`${game.slug}: invalid ${key}`);
    assert.equal(new Set(game[key]).size,game[key].length,`${game.slug}: duplicate ${key}`);
  }
  for (const key of ['gameboxScore','retroScore','hiddenGemScore','revivalPotential']) assert.ok(Number.isInteger(game[key]) && game[key] >= 0 && game[key] <= 100,`${game.slug}: ${key}`);
  assert.equal(game.facts.verification?.status,'verified',`${game.slug}: verification`);
  assert.match(game.facts.verification.verifiedAt,/^\d{4}-\d{2}-\d{2}$/);
  const evidence = audit.find(record=>record.slug === game.slug);
  assert.ok(evidence?.pageTitle,`${game.slug}: no source title`);
  assert.equal(evidence.normalized.year,game.year,`${game.slug}: year conflicts with source`);
  assert.deepEqual(evidence.normalized.platforms,game.platforms,`${game.slug}: platforms conflict with source`);
  for (const key of ['title','year','developers','publishers','platforms']) {
    assert.ok(game.facts.verification.fields.includes(key),`${game.slug}: missing verification field ${key}`);
    assert.ok(game.facts.sources.some(source=>source.fields.includes(key)),`${game.slug}: missing source for ${key}`);
  }
  for (const source of game.facts.sources) {
    assert.equal(new URL(source.url).protocol,'https:');
    assert.ok(source.label && source.accessedAt,`${game.slug}: source lacks label/date`);
    if (new URL(source.url).hostname === 'en.wikipedia.org') assert.ok(source.revisionId,`${game.slug}: missing source revision`);
  }
  assert.equal(game.editorial.scorePolicy,'provisional-editorial-v1');
  assert.ok(Object.isFrozen(game) && Object.isFrozen(game.platforms),`${game.slug}: mutable export`);
}
for (const kind of discoveryKinds) {
  const values=discoveryValues(kind);
  assert.equal(new Set(values.map(value=>value.slug)).size,values.length,`${kind}: slug collision`);
  for (const {value,slug} of values) assert.ok(slug && slug===slugify(value));
}
console.log('PASS: 100 unique games, factual/editorial joins, sources, verification, score ranges, taxonomies and immutable exports');
