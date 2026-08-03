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
    const menuItems = [...document.querySelectorAll('#comp-j91nuigkitemsContainer > li')]
      .map((item) => {
        const link = item.querySelector(':scope > a[href]');
        const children = [...item.querySelectorAll(':scope > ul > li > a[href]')]
          .map((child) => ({ href: child.href, label: child.textContent.trim() }));
        return link?.textContent.trim() ? { href: link.href, label: link.textContent.trim(), children } : null;
      })
      .filter(Boolean);
    if (!menuItems.length) return;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mobile-menu-toggle';
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';

    const menu = document.createElement('nav');
    menu.className = 'mobile-menu';
    menu.setAttribute('aria-label', 'Site navigation');
    menuItems.forEach(({ href, label, children }) => {
      const group = document.createElement('div');
      group.className = children.length ? 'mobile-menu-group' : 'mobile-menu-item';
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      group.append(link);
      if (children.length) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mobile-submenu-toggle';
        button.setAttribute('aria-label', `Show ${label} pages`);
        button.setAttribute('aria-expanded', 'false');
        button.textContent = '+';
        const submenu = document.createElement('div');
        submenu.className = 'mobile-submenu';
        submenu.hidden = true;
        children.forEach(({ href: childHref, label: childLabel }) => {
          const childLink = document.createElement('a');
          childLink.href = childHref;
          childLink.textContent = childLabel;
          submenu.append(childLink);
        });
        button.addEventListener('click', () => {
          const open = submenu.hidden;
          submenu.hidden = !open;
          button.textContent = open ? '−' : '+';
          button.setAttribute('aria-expanded', String(open));
          button.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} ${label} pages`);
        });
        group.append(button, submenu);
      }
      menu.append(group);
    });
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '×' : '☰';
    });
    document.querySelector('#SITE_HEADER')?.append(toggle, menu);
  };

  const mountDesktopDropdowns = () => {
    if (window.matchMedia('(max-width: 700px)').matches) return;
    const menu = document.querySelector('#comp-j91nuigkitemsContainer');
    if (!menu || menu.dataset.staticDropdownsMounted) return;
    menu.dataset.staticDropdownsMounted = 'true';
    menu.classList.add('static-dropdowns-enabled');
    [...menu.children].forEach((item) => {
      const submenu = item.querySelector(':scope > ul');
      const button = item.querySelector(':scope > button');
      if (!submenu || !button) return;
      submenu.removeAttribute('aria-hidden');
      const setOpen = (open) => {
        item.classList.toggle('static-submenu-open', open);
        button.setAttribute('aria-expanded', String(open));
      };
      button.addEventListener('click', (event) => {
        event.preventDefault();
        setOpen(!item.classList.contains('static-submenu-open'));
      });
      item.addEventListener('mouseenter', () => setOpen(true));
      item.addEventListener('mouseleave', () => setOpen(false));
      item.addEventListener('focusin', () => setOpen(true));
      item.addEventListener('focusout', () => window.setTimeout(() => {
        if (!item.contains(document.activeElement)) setOpen(false);
      }));
    });
  };

  // Wix finishes wiring component styles after parsing the document. Re-run for
  // a short window so late-added component rules receive the same treatment.
  [0, 100, 500, 1_500, 3_000].forEach((delay) => window.setTimeout(() => {
    completeAnimations();
    hideLoginControl();
    mountMobileMenu();
    mountDesktopDropdowns();
  }, delay));
})();
