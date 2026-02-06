(function () {
  var body = document.body;
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navDrawer = document.querySelector('[data-nav-drawer]');
  var navOverlay = document.querySelector('[data-nav-overlay]');
  var desktopMediaQuery = window.matchMedia('(min-width: 64rem)');
  var trapHandler = null;

  function getFocusable(container) {
    if (!container) {
      return [];
    }

    return Array.prototype.slice
      .call(
        container.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
      .filter(function (node) {
        return node.offsetParent !== null;
      });
  }

  function closeDrawer(options) {
    if (!navDrawer || !navToggle || !navOverlay) {
      return;
    }

    var shouldFocusToggle = options && options.focusToggle;
    navDrawer.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('is-visible');
    body.classList.remove('nav-open');

    window.setTimeout(function () {
      if (!navDrawer.classList.contains('is-open')) {
        navOverlay.hidden = true;
      }
    }, 220);

    if (trapHandler) {
      document.removeEventListener('keydown', trapHandler);
      trapHandler = null;
    }

    if (shouldFocusToggle) {
      navToggle.focus();
    }
  }

  function openDrawer() {
    if (!navDrawer || !navToggle || !navOverlay) {
      return;
    }

    navOverlay.hidden = false;
    navDrawer.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('nav-open');

    requestAnimationFrame(function () {
      navOverlay.classList.add('is-visible');
    });

    var focusable = getFocusable(navDrawer);
    if (focusable.length) {
      focusable[0].focus();
    }

    trapHandler = function (event) {
      if (!navDrawer.classList.contains('is-open')) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer({ focusToggle: true });
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      var activeFocusable = getFocusable(navDrawer);
      if (!activeFocusable.length) {
        return;
      }

      var first = activeFocusable[0];
      var last = activeFocusable[activeFocusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', trapHandler);
  }

  if (navToggle && navDrawer && navOverlay) {
    navToggle.addEventListener('click', function () {
      var isOpen = navDrawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer({ focusToggle: false });
      } else {
        openDrawer();
      }
    });

    navOverlay.addEventListener('click', function () {
      closeDrawer({ focusToggle: true });
    });

    navDrawer.addEventListener('click', function (event) {
      var clickedLink = event.target.closest('a[href]');
      if (!clickedLink) {
        return;
      }
      closeDrawer({ focusToggle: false });
    });

    if (typeof desktopMediaQuery.addEventListener === 'function') {
      desktopMediaQuery.addEventListener('change', function (event) {
        if (event.matches) {
          closeDrawer({ focusToggle: false });
        }
      });
    }
  }

  var sectionIndicator = document.querySelector('[data-section-indicator]');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main [data-section-id]'));
  if (sectionIndicator && sections.length > 1) {
    var links = [];

    sections.forEach(function (section, index) {
      var sectionId = section.id || 'section-' + (index + 1);
      section.id = sectionId;

      var dot = document.createElement('a');
      var label = section.getAttribute('data-section-label') || 'Section ' + (index + 1);
      dot.href = '#' + sectionId;
      dot.setAttribute('aria-label', label);
      sectionIndicator.appendChild(dot);
      links.push(dot);
    });

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          var activeId = entry.target.id;
          links.forEach(function (link) {
            var isActive = link.getAttribute('href') === '#' + activeId;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      },
      {
        threshold: 0.52,
        rootMargin: '-30% 0px -35% 0px'
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  var year = document.querySelector('[data-year]');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      body.classList.add('is-ready');
    });
  });
})();
