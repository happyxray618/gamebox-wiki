import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, '.portable-check');
// Exercise a different host at its domain root: no GAMEBOX/GitHub asset dependency may remain.
execFileSync(process.execPath, [path.join(import.meta.dirname, 'build-standalone-products.mjs'), '--product', 'winter-atelier', '--out', output, '--site-url', 'https://portable.example'], {stdio:'pipe'});
function check(directory, base) {
  for (const name of ['index.html','press.html','privacy-policy.html']) {
    const html = fs.readFileSync(path.join(directory,name),'utf8');
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^mailto:/.test(m[1])) continue;
      const resolved = new URL(m[1].replaceAll('&amp;','&'),base+name);
      const site = new URL(base);
      if (resolved.origin !== site.origin || !resolved.pathname.startsWith(site.pathname)) continue;
      const relative = decodeURIComponent(resolved.pathname.slice(site.pathname.length)) || 'index.html';
      assert(fs.existsSync(path.join(directory,relative)),`${name}: missing ${relative}`);
    }
  }
  const html = fs.readFileSync(path.join(directory,'index.html'),'utf8');
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.url,base);
  assert.equal((html.match(/<details/g)||[]).length,10);
  assert(!html.includes('nobody-workshop-privacy'));
  const imageNames=fs.readdirSync(path.join(directory,'images')).sort();
  assert.equal(imageNames.length,8);
  for(const name of imageNames){assert(fs.readFileSync(path.join(directory,'images',name)).equals(fs.readFileSync(path.join(root,'standalone-products/winter-atelier/images',name))));}
}
check(path.join(root,'public/nobodyworkshop/winter-atelier'),'https://gamebox.wiki/nobodyworkshop/winter-atelier/');
check(output,'https://portable.example/');
assert(!fs.readFileSync(path.join(output,'index.html'),'utf8').includes('https://gamebox.wiki'));
console.log('PASS: mounted and independent-root links, metadata, ten FAQs and eight unchanged assets');
