const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const render = text => hexo.render.renderSync({ text, engine: 'md' });
hexo.extend.filter.register('before_post_render', function (data) {
  data.content = data.content.replace(/^:::[ \t]+(info|note|tip|warning|danger|success)(?:[ \t]+(.*))?[ \t]*\r?\n([\s\S]*?)^:::[ \t]*$/gm,
    (_, type, title, body) => '\n\n<aside class="note ' + type + '">' + (title ? '<strong>' + escape(title) + '</strong>' : '') + render(body) + '</aside>\n\n');
  return data;
});
hexo.extend.tag.register('note', (args, content) => {
  const [type = 'info', ...title] = args;
  return '<aside class="note ' + escape(type) + '">' + (title.length ? '<strong>' + escape(title.join(' ')) + '</strong>' : '') + render(content) + '</aside>';
}, { ends: true });
hexo.extend.tag.register('tabs', (args, content) => {
  const tabs = [...content.matchAll(/<!--\s*tab\s+(.+?)\s*-->([\s\S]*?)<!--\s*endtab\s*-->/g)];
  if (!tabs.length) return render(content);
  return '<section class="post-tabs" aria-label="' + escape(args.join(' ')) + '">' + tabs.map((tab, index) =>
    '<details' + (index === 0 ? ' open' : '') + '><summary>' + escape(tab[1]) + '</summary>' + render(tab[2]) + '</details>').join('') + '</section>';
}, { ends: true });
hexo.extend.generator.register('categories-index', function () {
  return { path: 'categories/index.html', layout: ['categories'], data: { title: '分类' } };
});
