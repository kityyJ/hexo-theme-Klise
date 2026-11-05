import { cp, mkdir, readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const site = fileURLToPath(new URL('../', import.meta.url));
const root = path.resolve(site, '..');
const theme = path.join(site, 'themes/Klise');
await mkdir(theme, { recursive: true });
for (const name of ['_config.yml', 'layout', 'scripts', 'source']) {
  await cp(path.join(root, name), path.join(theme, name), { recursive: true });
}
const snapshot = JSON.parse(await readFile(path.join(site, 'import/published-posts.json'), 'utf8'));
if (snapshot.count !== snapshot.posts.length) throw new Error('Incomplete published snapshot');
const seen = new Set();
await mkdir(path.join(site, 'source/_posts'), { recursive: true });
for (const post of snapshot.posts) {
  if (!/^[a-zA-Z0-9-]+$/.test(String(post.id)) || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(post.public_path)) {
    throw new Error('Invalid source ID or public path');
  }
  if (seen.has(post.public_path)) throw new Error('Duplicate public path');
  seen.add(post.public_path);
  const meta = {
    title: post.title, date: post.date, updated: post.updated,
    categories: post.categories, tags: post.tags,
    permalink: post.public_path + '/', jia_id: String(post.id),
    source_url: post.source_url, cover: post.cover, excerpt: post.excerpt
  };
  const front = Object.entries(meta).map(([key, value]) => key + ': ' + JSON.stringify(value)).join('\n');
  await writeFile(path.join(site, 'source/_posts/jia-' + post.id + '.md'), '---\n' + front + '\n---\n' + post.content, 'utf8');
}
const expected = new Set(snapshot.posts.map(post => 'jia-' + post.id + '.md'));
for (const name of await readdir(path.join(site, 'source/_posts'))) {
  if (/^jia-[a-zA-Z0-9-]+\.md$/.test(name) && !expected.has(name)) await unlink(path.join(site, 'source/_posts', name));
}
console.log('Prepared ' + snapshot.count + ' published posts; pending edits are excluded.');
