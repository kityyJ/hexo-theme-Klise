const PAGES_HOST = 'jia-klise.pages.dev';

export async function proxyRequest(request, fetchUpstream = fetch) {
  const incoming = new URL(request.url);
  const target = new URL(incoming);
  target.protocol = 'https:';
  target.host = PAGES_HOST;
  const forwarded = new Request(target, request);
  forwarded.headers.delete('host');
  const upstream = await fetchUpstream(forwarded, { redirect: 'manual' });
  const headers = new Headers(upstream.headers);
  const location = headers.get('location');
  if (location) {
    const redirect = new URL(location, target);
    if (redirect.hostname === PAGES_HOST) {
      redirect.protocol = incoming.protocol;
      redirect.host = incoming.host;
      headers.set('location', redirect.href);
    }
  }
  headers.set('x-jia-route', 'cdn-klise-pages');
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers
  });
}

export default {
  fetch(request) {
    return proxyRequest(request);
  }
};
