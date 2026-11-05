(() => {
  const feed = document.querySelector('.home-feed');
  const article = document.querySelector('.article-body');
  if (!feed && !article) return;
  const mobile = matchMedia('(max-width: 768px)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.createElement('button');
  progress.className = 'reading-progress';
  progress.type = 'button';
  progress.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="progress-track" cx="24" cy="24" r="21"/><circle class="progress-value" cx="24" cy="24" r="21" pathLength="100"/></svg><span>0%</span>';
  document.body.append(progress);
  const label = progress.querySelector('span');
  const ring = progress.querySelector('.progress-value');
  let queued = false;
  function update() {
    queued = false;
    let percent, description;
    if (feed) {
      const shown = feed.querySelectorAll('.post-item').length;
      const total = Math.max(shown, Number(feed.dataset.total) || shown);
      percent = total ? Math.round(shown / total * 100) : 100;
      description = '已展示 ' + shown + '/' + total + ' 篇文章';
    } else {
      const rect = article.getBoundingClientRect();
      const distance = rect.height - innerHeight;
      percent = distance <= 0 ? 100 : Math.round(Math.max(0, Math.min(1, -rect.top / distance)) * 100);
      description = '阅读进度 ' + percent + '%';
    }
    label.textContent = percent + '%';
    ring.style.strokeDashoffset = String(100 - percent);
    progress.title = description + '，点击返回顶部';
    progress.setAttribute('aria-label', progress.title);
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }
  progress.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' }));
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  new ResizeObserver(schedule).observe(article || feed);
  update();
  if (!feed || !('IntersectionObserver' in window)) return;
  const pager = feed.querySelector('.pager');
  const status = document.createElement('button');
  status.className = 'load-more-status';
  status.type = 'button';
  status.setAttribute('aria-live', 'polite');
  feed.append(status);
  let next = feed.dataset.next;
  let busy = false;
  const seen = new Set([...feed.querySelectorAll('.post-item-title a')].map(link => new URL(link.href).pathname));
  const visited = new Set([location.pathname]);
  const observer = new IntersectionObserver(entries => {
    if (mobile.matches && entries.some(entry => entry.isIntersecting)) loadMore();
  }, { rootMargin: '0px 0px 140px 0px' });
  function observe() {
    feed.classList.toggle('infinite-ready', mobile.matches);
    status.hidden = !mobile.matches;
    if (!mobile.matches) { observer.disconnect(); return; }
    status.textContent = next ? '继续下滑加载文章' : '文章已全部显示';
    status.disabled = !next;
    if (next) observer.observe(status);
  }
  async function loadMore() {
    if (!next || busy || !mobile.matches) return;
    busy = true;
    observer.unobserve(status);
    status.disabled = true;
    status.textContent = '正在加载…';
    try {
      const target = new URL(next, location.href);
      if (target.origin !== location.origin || visited.has(target.pathname)) throw new Error('Invalid next page');
      const response = await fetch(target, { headers: { accept: 'text/html' } });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
      const nextFeed = parsed.querySelector('.home-feed');
      if (!nextFeed) throw new Error('Missing article list');
      const chunk = document.createElement('section');
      chunk.className = 'feed-chunk';
      for (const post of nextFeed.querySelectorAll('.post-item')) {
        const link = post.querySelector('.post-item-title a');
        if (!link) throw new Error('Missing article link');
        const key = new URL(link.getAttribute('href'), location.origin).pathname;
        if (!seen.has(key)) { seen.add(key); chunk.append(document.importNode(post, true)); }
      }
      if (!chunk.childElementCount) throw new Error('Empty article batch');
      status.before(chunk);
      visited.add(target.pathname);
      next = nextFeed.dataset.next || '';
      update();
      status.textContent = next ? '继续下滑加载文章' : '文章已全部显示';
      status.disabled = !next;
      if (next && mobile.matches) observer.observe(status);
    } catch (error) {
      console.error('Article loading failed:', error);
      status.textContent = '加载失败，点击重试';
      status.disabled = false;
    } finally { busy = false; }
  }
  status.addEventListener('click', loadMore);
  mobile.addEventListener('change', observe);
  observe();
})();
