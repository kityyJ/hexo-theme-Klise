import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
const SOURCE = 'https://blog.yigeyao.com';
const snapshotFile = new URL('../import/published-posts.json', import.meta.url);

export function collectPublished(list, search, previous = { posts: [] }) {
  if (!Array.isArray(list.posts) || !Array.isArray(search)) throw new Error('Invalid source response');
  const published = list.posts.filter(post => post.status === 'published');
  if (!published.length) throw new Error('Source has no published posts; retaining existing snapshot');
  const documents = new Map(search.map(post => [new URL(post.url, SOURCE).pathname.replace(/^\/|\/$/g, ''), post]));
  const seen = new Set();
  return published.map(post => {
    const route = String(post.public_path || '');
    if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(route) || seen.has(route)) throw new Error('Invalid or duplicate source path');
    seen.add(route);
    if (!/^[a-zA-Z0-9-]+$/.test(String(post.id))) throw new Error('Invalid source ID');
    const document = documents.get(route);
    if (!document || document.title !== post.title || typeof document.text !== 'string' || !document.text.trim()) {
      throw new Error('Missing or inconsistent published body: ' + route);
    }
    if (!post.category_name || !Array.isArray(post.tags) || !post.tags.every(tag => typeof tag === 'string')) throw new Error('Missing source taxonomy');
    const date = new Date(post.published_at).toISOString();
    const old = previous.posts.find(old => String(old.id) === String(post.id));
    return {
      id: post.id, title: post.title, content: document.text, excerpt: post.excerpt || '',
      cover: post.cover || '', date, updated: post.updated_at || old?.updated || date,
      categories: [post.category_name], tags: post.tags, public_path: route,
      source_url: SOURCE + '/' + route + '/',
      source_published_at: post.source_published_at || '', source_urls: post.source_urls || old?.source_urls || []
    };
  });
}

async function json(path) {
  const response = await fetch(SOURCE + path, { signal: AbortSignal.timeout(30000), headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error('Source HTTP ' + response.status + ': ' + path);
  return response.json();
}

async function syncSource() {
  const previous = JSON.parse(await readFile(snapshotFile, 'utf8'));
  const [list, search] = await Promise.all([json('/__jia/cloud-posts.json'), json('/flatpaper-search.json')]);
  const posts = collectPublished(list, search, previous);
  if (previous.source === SOURCE && JSON.stringify(previous.posts) === JSON.stringify(posts)) {
    console.log('Source unchanged: ' + posts.length + ' published posts.');
    return;
  }
  const snapshot = { source: SOURCE, imported_at: new Date().toISOString(), count: posts.length, posts };
  await writeFile(snapshotFile, JSON.stringify(snapshot, null, 2) + '\n');
  console.log('Synced ' + posts.length + ' published posts from ' + SOURCE);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await syncSource();
