(() => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('menu-open');
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });
  matchMedia('(min-width: 661px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('main > section[id]')];
    const activeSections = new Map();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => activeSections.set(entry.target.id, entry.isIntersecting));
      const active = sections.find(section => activeSections.get(section.id));
      nav.querySelectorAll('a').forEach(link => {
        if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin: '-20% 0px -45% 0px', threshold: 0});
    sections.forEach(section => observer.observe(section));
  }

  document.querySelectorAll('[data-open-dialog]').forEach(button => {
    const dialog = document.getElementById(button.dataset.openDialog);
    button.addEventListener('click', () => {
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('dialog-open');
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      button.focus({preventScroll: true});
    });
  });

  const copyButton = document.querySelector('.copy-email');
  const copyStatus = document.querySelector('.copy-status');
  let statusTimer;
  copyButton.addEventListener('click', async () => {
    const email = 'shatrujit.mishra.pg25@nsut.ac.in';
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = 'Email copied';
      copyButton.setAttribute('aria-label', 'Email address copied');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.email-row > a'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = 'Email selected — use your device’s copy command';
    }
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      copyStatus.textContent = '';
      copyButton.setAttribute('aria-label', 'Copy email address');
    }, 4500);
  });
})();
