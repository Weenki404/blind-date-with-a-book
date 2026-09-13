/* =========================================================
   WEENKI MATCHMAKING HOUSE — FOOTER CLEARANCE GUARD V1
   Keeps the footer below the absolute-positioned reveal/review
   without changing apartment art, review animation, or sky CSS.
   ========================================================= */

(() => {
  const CLEARANCE = 48;

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  function installGuard(experience) {
    if (!experience || experience.dataset.footerGuard === 'on') return;
    experience.dataset.footerGuard = 'on';

    const baseMarginBottom =
      parseFloat(window.getComputedStyle(experience).marginBottom) || 0;

    let resizeObserver = null;
    let observedTargets = new Set();
    let raf = 0;

    function findTargets() {
      /*
       * The reveal is absolutely positioned on desktop.
       * The review system may live inside the reveal or elsewhere
       * inside the experience depending on the apartment version.
       */
      return [
        experience.querySelector('.reveal'),
        experience.querySelector('.date-review'),
        experience.querySelector('.review-panel')
      ].filter(Boolean);
    }

    function refreshObservedTargets() {
      if (!resizeObserver) return;

      const current = new Set(findTargets());

      for (const el of observedTargets) {
        if (!current.has(el)) resizeObserver.unobserve(el);
      }

      for (const el of current) {
        if (!observedTargets.has(el)) resizeObserver.observe(el);
      }

      observedTargets = current;
    }

    function updateClearance() {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        refreshObservedTargets();

        const experienceRect = experience.getBoundingClientRect();
        let furthestBottom = experienceRect.bottom;
        let hasVisibleDynamicContent = false;

        for (const el of findTargets()) {
          if (!isVisible(el)) continue;

          hasVisibleDynamicContent = true;
          const rect = el.getBoundingClientRect();
          furthestBottom = Math.max(furthestBottom, rect.bottom);
        }

        const overflow = Math.max(0, furthestBottom - experienceRect.bottom);

        /*
         * Reserve only the space that spills outside .experience,
         * plus a little civilized breathing room before the footer.
         * Using margin-bottom avoids fighting each apartment's
         * protected min-height / mobile layout rules.
         */
        const extra = hasVisibleDynamicContent ? overflow + CLEARANCE : 0;
        experience.style.marginBottom = `${baseMarginBottom + extra}px`;
      });
    }

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateClearance);
      resizeObserver.observe(experience);
      refreshObservedTargets();
    }

    const mutationObserver = new MutationObserver(updateClearance);
    mutationObserver.observe(experience, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'style', 'aria-hidden']
    });

    window.addEventListener('resize', updateClearance, { passive: true });
    window.addEventListener('load', updateClearance, { once: true });

    // Review animation/transitions can finish after the initial mutation.
    document.addEventListener('click', () => {
      setTimeout(updateClearance, 0);
      setTimeout(updateClearance, 300);
      setTimeout(updateClearance, 900);
    });

    updateClearance();
  }

  function boot() {
    document.querySelectorAll('.experience').forEach(installGuard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
