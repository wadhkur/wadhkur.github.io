(() => {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const body = document.body;
  const btns = Array.from(document.querySelectorAll('[data-burger]'));
  const overlay = document.querySelector('.drawer-overlay');
  const drawer = document.querySelector('.drawer');
  const focusableSel = 'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])';
  let lastFocus = null;

  const setExpanded = (v) => btns.forEach(b => b.setAttribute('aria-expanded', String(v)));
  const openNav = () => {
    lastFocus = document.activeElement;
    body.classList.add('nav-open');
    setExpanded(true);
    drawer?.querySelector('a')?.focus();
  };
  const closeNav = () => {
    body.classList.remove('nav-open');
    setExpanded(false);
    lastFocus?.focus?.();
  };
  btns.forEach(b => b.addEventListener('click', () => {
    body.classList.contains('nav-open') ? closeNav() : openNav();
  }));
  overlay?.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (!body.classList.contains('nav-open')) return;
    if (e.key === 'Escape') closeNav();

    if (e.key === 'Tab' && drawer) {
      const f = Array.from(drawer.querySelectorAll(focusableSel));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  drawer?.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) closeNav();
  });

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[data-nav]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.setAttribute('aria-current','page');
  });

  const y = document.querySelector('[data-year]');
  if (y) y.textContent = String(new Date().getFullYear());

  const hero = document.querySelector('.hero');
  if (hero && !reduced) requestAnimationFrame(() => hero.classList.add('play'));
  if (hero && reduced) hero.classList.add('play');

  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const dividerEls = Array.from(document.querySelectorAll('.divider'));
  const maskEls = Array.from(document.querySelectorAll('.mask'));

  if (reduced) {
    revealEls.forEach(el => el.classList.add('in'));
    dividerEls.forEach(el => el.classList.add('in'));
    maskEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const ent of entries) {
        if (!ent.isIntersecting) continue;
        ent.target.classList.add('in');
        io.unobserve(ent.target);
      }
    }, { threshold: 0.14 });

    [...revealEls, ...dividerEls, ...maskEls].forEach(el => io.observe(el));
  }

  document.querySelectorAll('[data-accordion]').forEach(acc => {
    const items = Array.from(acc.querySelectorAll('.acc-item'));
    items.forEach(item => {
      const btn = item.querySelector('.acc-btn');
      const panel = item.querySelector('.acc-panel');
      if (!btn || !panel) return;

      if (!btn.querySelector('.chev')) {
        const chev = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chev.setAttribute('class','chev');
        chev.setAttribute('aria-hidden','true');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', 'assets/icons/sprite.svg#i-chevron');
        chev.appendChild(use);
        btn.appendChild(chev);
      }

      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        items.forEach(it => {
          const b = it.querySelector('.acc-btn');
          const p = it.querySelector('.acc-panel');
          b?.setAttribute('aria-expanded','false');
          if (p) p.style.maxHeight = '0px';
        });
        if (!open) {
          btn.setAttribute('aria-expanded','true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  });

  document.querySelectorAll('[data-timeline]').forEach(tl => {
    const track = tl.querySelector('.timeline-track');
    if (!track) return;
    const set = () => {
      const r = tl.getBoundingClientRect();
      const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      track.style.setProperty('--p', `${Math.round(p*100)}%`);
    };
    set();
    window.addEventListener('scroll', set, { passive:true });
    window.addEventListener('resize', set);
  });

  if (!reduced) {
    const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
    if (parallaxEls.length) {
      let latestY = 0;
      window.addEventListener('scroll', () => { latestY = window.scrollY || 0; }, { passive:true });
      const tick = () => {
        const y = latestY;
        for (const el of parallaxEls) {
          const speed = Number(el.getAttribute('data-parallax')) || 0.12;
          el.style.transform = `translateY(${(y * speed) % 6}px)`;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }
})();
