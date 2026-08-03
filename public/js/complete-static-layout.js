/*
 * Archived Wix pages include entrance animations that the original Wix runtime
 * marks as complete. In the standalone static build that runtime is absent,
 * leaving those elements at their initial (often invisible) animation state.
 * Render the completed state so the archive matches the captured live pages.
 */
(() => {
  const completeAnimations = () => {
    document.querySelectorAll('*').forEach((element) => {
      const styles = window.getComputedStyle(element);
      if (styles.animationName === 'none') return;

      element.style.setProperty('animation', 'none', 'important');
      element.style.setProperty('opacity', '1', 'important');
      element.style.setProperty('transform', 'none', 'important');
      element.style.setProperty('clip-path', 'none', 'important');
    });
  };

  const hideLoginControl = () => {
    document.querySelectorAll('#comp-jg8e4tpy').forEach((element) => {
      element.style.setProperty('display', 'none', 'important');
    });
  };

  const mountMobileMenu = () => {
    if (window.matchMedia('(min-width: 701px)').matches || document.querySelector('.mobile-menu-toggle')) return;
    const links = [...document.querySelectorAll('#comp-j91nuigk a[href]')]
      .filter((link) => link.textContent.trim())
      .map((link) => ({ href: link.href, label: link.textContent.trim() }));
    if (!links.length) return;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mobile-menu-toggle';
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';

    const menu = document.createElement('nav');
    menu.className = 'mobile-menu';
    menu.setAttribute('aria-label', 'Site navigation');
    menu.innerHTML = links.map(({ href, label }) => `<a href="${href}">${label}</a>`).join('');
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '×' : '☰';
    });
    document.querySelector('#SITE_HEADER')?.append(toggle, menu);
  };

  // Wix finishes wiring component styles after parsing the document. Re-run for
  // a short window so late-added component rules receive the same treatment.
  [0, 100, 500, 1_500, 3_000].forEach((delay) => window.setTimeout(() => {
    completeAnimations();
    hideLoginControl();
    mountMobileMenu();
  }, delay));
})();
