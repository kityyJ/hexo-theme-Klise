import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proxyRequest } from './edge-proxy.mjs';

test('forwards the original path and query to Pages without a conflicting Host', async () => {
  const result = await proxyRequest(new Request('https://blog.jia.nz/game/td2/?page=2', { headers: { host: 'blog.jia.nz' } }), async (request, options) => {
    assert.equal(request.url, 'https://jia-klise.pages.dev/game/td2/?page=2');
    assert.equal(request.headers.get('host'), null);
    assert.equal(options.redirect, 'manual');
    return new Response('<h1>Article</h1>', { headers: { 'content-type': 'text/html', etag: '"asset"' } });
  });
  assert.equal(await result.text(), '<h1>Article</h1>');
  assert.equal(result.headers.get('etag'), '"asset"');
  assert.equal(result.headers.get('x-jia-route'), 'cdn-klise-pages');
});

test('keeps method and request body', async () => {
  const result = await proxyRequest(new Request('https://blog.jia.nz/submit', { method: 'POST', body: 'hello' }), async request => {
    assert.equal(request.method, 'POST');
    assert.equal(await request.text(), 'hello');
    return new Response(null, { status: 405 });
  });
  assert.equal(result.status, 405);
});

test('rewrites only Pages redirects back to the public blog hostname', async () => {
  const result = await proxyRequest(new Request('https://blog.jia.nz/archives'), async () => new Response(null, {
    status: 301, headers: { location: 'https://jia-klise.pages.dev/archives/?page=2#year' }
  }));
  assert.equal(result.status, 301);
  assert.equal(result.headers.get('location'), 'https://blog.jia.nz/archives/?page=2#year');
});

test('preserves external redirects', async () => {
  const result = await proxyRequest(new Request('https://blog.jia.nz/external'), async () => new Response(null, {
    status: 302, headers: { location: 'https://github.com/kityyJ' }
  }));
  assert.equal(result.headers.get('location'), 'https://github.com/kityyJ');
});

test('preserves 404 and HEAD responses', async () => {
  const result = await proxyRequest(new Request('https://blog.jia.nz/missing', { method: 'HEAD' }), async request => {
    assert.equal(request.method, 'HEAD');
    return new Response(null, { status: 404, headers: { 'content-type': 'text/html' } });
  });
  assert.equal(result.status, 404);
  assert.equal(await result.text(), '');
});
