(function () {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (!menu.classList.contains('is-open')) return;
      const target = event.target;
      if (target instanceof Element && !menu.contains(target) && !toggle.contains(target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        closeMenu();
      }
    });
  }

  const yearEl = document.getElementById('site-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
