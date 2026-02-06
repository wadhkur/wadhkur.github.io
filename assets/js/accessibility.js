(function () {
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function syncReducedClass() {
    document.documentElement.classList.toggle('prefers-reduced-motion', reducedMotionQuery.matches);
  }

  syncReducedClass();
  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', syncReducedClass);
  }

  var skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function () {
      var targetId = (skipLink.getAttribute('href') || '#main').slice(1);
      var target = document.getElementById(targetId);
      if (!target) {
        return;
      }

      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: false });
      target.addEventListener(
        'blur',
        function () {
          target.removeAttribute('tabindex');
        },
        { once: true }
      );
    });
  }

  var page = window.location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('a[data-nav-link]');
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) {
      return;
    }
    var normalizedHref = href.replace('./', '');
    if (normalizedHref === page || (page === '' && normalizedHref === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
