(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* comparsa allo scroll */
  const revealIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll('[data-reveal]').forEach(el => reduce ? el.classList.add('is-in') : revealIO.observe(el));

  /* contatori: anima ogni numero del testo (es. "4–18") */
  const countIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    if (reduce) return;
    const el = e.target, final = el.textContent, t0 = performance.now(), dur = 1400;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1), k = 1 - Math.pow(1 - p, 3);
      el.textContent = final.replace(/\d+/g, m => Math.round(+m * k));
      if (p < 1) requestAnimationFrame(tick); else el.textContent = final;
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* frase che si accende parola per parola mentre scorri */
  document.querySelectorAll('[data-words]').forEach(el => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const spans = text.split(/\s+/).map((w, i, a) => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = w; s.setAttribute('aria-hidden', 'true');
      el.append(s); if (i < a.length - 1) el.append(' ');
      return s;
    });
    const update = () => {
      const r = el.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .3)));
      const n = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });

  /* carosello */
  document.querySelectorAll('[data-carousel]').forEach(c => {
    const track = c.querySelector('.carousel__track'), bar = c.querySelector('.carousel__bar i');
    const step = () => track.querySelector('.card').getBoundingClientRect().width + 24;
    c.querySelector('[data-prev]').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    c.querySelector('[data-next]').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    const upd = () => {
      const max = track.scrollWidth - track.clientWidth, w = Math.min(1, track.clientWidth / track.scrollWidth);
      const p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.width = (w * 100) + '%';
      bar.style.transform = `translateX(${p * (1 / w - 1) * 100}%)`;
    };
    track.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd); upd();
  });

  /* menu a tutto schermo */
  const menu = document.getElementById('menu'), openBtn = document.querySelector('[data-menu-open]');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    (open ? menu.querySelector('a') : openBtn).focus();
  };
  openBtn.addEventListener('click', () => setMenu(true));
  menu.querySelector('[data-menu-close]').addEventListener('click', () => setMenu(false));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });

  /* ricerca */
  const dlg = document.getElementById('search'), q = document.getElementById('search-q'), out = document.getElementById('search-results');
  let index = null;
  const labels = { posts: 'Blog', news: 'News', portfolio: 'Portfolio' };
  const render = () => {
    const term = q.value.trim().toLowerCase();
    out.textContent = '';
    if (!index || term.length < 2) return;
    const hits = index.filter(p => (p.title + ' ' + p.text).toLowerCase().includes(term)).slice(0, 8);
    if (!hits.length) { const li = document.createElement('li'); li.textContent = 'Nessun risultato.'; out.append(li); return; }
    hits.forEach(p => {
      const li = document.createElement('li'), a = document.createElement('a'), s = document.createElement('small');
      a.href = p.url; a.textContent = p.title; s.textContent = labels[p.type] || p.type; a.append(s); li.append(a); out.append(li);
    });
  };
  document.querySelector('[data-search-open]').addEventListener('click', async () => {
    dlg.showModal(); q.focus();
    if (!index) { try { index = await (await fetch(dlg.dataset.src)).json(); } catch { index = []; } }
    render();
  });
  q.addEventListener('input', render);
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
})();
