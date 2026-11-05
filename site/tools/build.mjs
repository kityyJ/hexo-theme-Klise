import Hexo from 'hexo';
import assert from 'node:assert/strict';
import { access, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const site = fileURLToPath(new URL('../', import.meta.url));
const snapshot = JSON.parse(await readFile(path.join(site, 'import/published-posts.json'), 'utf8'));
const hexo = new Hexo(site, {});
try {
  await hexo.init();
  await hexo.call('generate');
  const posts = hexo.locals.get('posts').toArray();
  assert.equal(posts.length, snapshot.count, 'Published post count');
  const report = [];
  for (const source of snapshot.posts) {
    const post = posts.find(post => post.jia_id === String(source.id));
    assert.ok(post, 'Missing ID ' + source.id);
    assert.equal(post.title, source.title);
    assert.equal(post.date.toISOString(), source.date, 'Publication date ' + source.id);
    assert.equal(post.updated.toISOString(), source.updated, 'Updated date ' + source.id);
    assert.deepEqual(post.tags.toArray().map(tag => tag.name).sort(), [...source.tags].sort(), 'Tags ' + source.id);
    assert.deepEqual(post.categories.toArray().map(category => category.name), source.categories, 'Category ' + source.id);
    assert.equal(decodeURI(post.path), source.public_path + '/index.html', 'Permalink ' + source.id);
    const raw = await readFile(path.join(site, 'source/_posts/jia-' + source.id + '.md'), 'utf8');
    const body = raw.slice(raw.indexOf('\n---\n', 4) + 5);
    assert.equal(body, source.content, 'Unmodified published body ' + source.id);
    const html = await readFile(path.join(site, 'public', post.path), 'utf8');
    assert.ok(html.includes(hexo.extend.helper.get('escape_html') ? source.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : source.title) || html.includes(source.title), 'Rendered title ' + source.id);
    assert.ok(!/{%\s*(?:note|tabs|endnote|endtabs)\b/.test(html), 'Unrendered component ' + source.id);
    report.push({ id: source.id, path: '/' + source.public_path + '/', date: source.date, updated: source.updated, categories: source.categories, tags: source.tags, title: source.title, body_sha256: createHash('sha256').update(body).digest('hex') });
  }
  for (const file of ['index.html', 'archives/index.html', 'tags/index.html', 'categories/index.html', 'about/index.html', '404.html', 'atom.xml', 'css/main.css', 'css/components.css', 'js/main.js']) {
    await access(path.join(site, 'public', file));
  }
  const css = await readFile(path.join(site, 'public/css/main.css'), 'utf8');
  assert.ok(css.length > 1000, 'Compiled theme CSS');
  await writeFile(path.join(site, 'public/import-verification.json'), JSON.stringify({ source: snapshot.source, count: report.length, posts: report }, null, 2));
  console.log('Verified ' + report.length + ' posts: exact bodies, dates, categories, tags, permalinks and generated files.');
} finally {
  await hexo.exit();
}
