(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var lineItems = Array.prototype.slice.call(document.querySelectorAll('[data-line]'));
  var panelItems = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));
  var allTargets = revealItems.concat(lineItems, panelItems);

  if (!allTargets.length) {
    return;
  }

  var revealGroupCounts = {};
  revealItems.forEach(function (item) {
    var manualDelay = item.getAttribute('data-reveal-delay');
    if (manualDelay) {
      item.style.setProperty('--reveal-delay', manualDelay + 'ms');
      return;
    }

    var groupName = item.getAttribute('data-reveal-group');
    if (!groupName) {
      return;
    }

    var groupIndex = revealGroupCounts[groupName] || 0;
    revealGroupCounts[groupName] = groupIndex + 1;
    item.style.setProperty('--reveal-delay', groupIndex * 85 + 'ms');
  });

  if (reducedMotion) {
    allTargets.forEach(function (target) {
      target.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  allTargets.forEach(function (target) {
    observer.observe(target);
  });
})();
