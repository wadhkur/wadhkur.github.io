(function () {
  document.documentElement.classList.add('js-enabled');

  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (event) => {
      const targetId = skipLink.getAttribute('href')?.replace('#', '') || 'main';
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener(
          'blur',
          () => target.removeAttribute('tabindex'),
          { once: true }
        );
      }
    });
  }

  // Mark current page link for assistive tech if not already set in markup
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isActive = (current === '' && href === 'index.html') || href === current;
    if (isActive && !link.hasAttribute('aria-current')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
