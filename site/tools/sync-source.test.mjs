import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectPublished } from './sync-source.mjs';
const published = { id: 1, title: 'Published', status: 'published', public_path: 'guide/test', published_at: '2026-01-02T03:04:05.000Z', category_name: '教程', tags: ['Tag'] };
const body = { title: 'Published', url: '/guide/test/', text: '## Original\n\nBody **unchanged**.' };
test('imports published bodies and metadata while excluding pages and drafts', () => {
  const posts = collectPublished({ posts: [published, { ...published, id: 2, status: 'draft' }] }, [body, { title: 'About', url: '/about/', text: 'page' }], { posts: [{ id: 1, updated: '2026-02-03T00:00:00.000Z' }] });
  assert.equal(posts.length, 1);
  assert.equal(posts[0].content, body.text);
  assert.equal(posts[0].date, published.published_at);
  assert.deepEqual(posts[0].categories, ['教程']);
  assert.deepEqual(posts[0].tags, ['Tag']);
  assert.equal(posts[0].public_path, 'guide/test');
  assert.equal(posts[0].updated, '2026-02-03T00:00:00.000Z');
});
test('rejects an incomplete or inconsistent source instead of publishing partial data', () => {
  assert.throws(() => collectPublished({ posts: [published] }, []), /Missing/);
  assert.throws(() => collectPublished({ posts: [] }, []), /no published posts/);
  assert.throws(() => collectPublished({ posts: [published, published] }, [body]), /duplicate/);
  assert.throws(() => collectPublished({ posts: [published] }, [{ ...body, title: 'Other' }]), /inconsistent/);
});
