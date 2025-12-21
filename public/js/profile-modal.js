// public/js/profile-modal.js
(function () {
  function qs(id) {
    return document.getElementById(id);
  }

  const btn = qs('profileBtn');
  const modal = qs('profileModal');

  if (!btn || !modal) return;

  const backdrop = modal.querySelector('[data-close]');
  const closeBtns = Array.from(modal.querySelectorAll('[data-close]'));

  const tabBtns = Array.from(modal.querySelectorAll('[data-tab]'));
  const panels = Array.from(modal.querySelectorAll('[data-panel]'));

  const themeToggle = qs('themeToggle');
  const fontMinus = qs('fontMinus');
  const fontPlus = qs('fontPlus');
  const fontReset = qs('fontReset');
  const motionToggle = qs('motionToggle');

  function open() {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    // Sync controls from prefs
    if (window.uiPrefs) {
      if (themeToggle) themeToggle.checked = window.uiPrefs.getTheme() === 'dark';
      if (motionToggle) motionToggle.checked = window.uiPrefs.getMotion() === 'reduced';
      const label = qs('fontLabel');
      if (label) label.textContent = String(window.uiPrefs.getFont() || 'md').toUpperCase();
    }

    // Focus first interactive element
    const first = modal.querySelector('button, a, input');
    if (first) first.focus();
  }

  function close() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    btn.focus();
  }

  function setTab(name) {
    const tab = String(name || 'help');
    tabBtns.forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    panels.forEach((p) => {
      const on = p.dataset.panel === tab;
      p.style.display = on ? 'block' : 'none';
    });
  }

  btn.addEventListener('click', () => {
    const isOpen = modal.classList.contains('show');
    if (isOpen) close();
    else open();
  });

  closeBtns.forEach((c) => c.addEventListener('click', close));

  tabBtns.forEach((b) => {
    b.addEventListener('click', () => setTab(b.dataset.tab));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) close();
  });

  // Settings wiring
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      if (!window.uiPrefs) return;
      window.uiPrefs.setTheme(themeToggle.checked ? 'dark' : 'light');
    });
  }

  function syncFontLabel() {
    const label = qs('fontLabel');
    if (!label || !window.uiPrefs) return;
    label.textContent = String(window.uiPrefs.getFont() || 'md').toUpperCase();
  }

  if (fontMinus) {
    fontMinus.addEventListener('click', () => {
      if (!window.uiPrefs) return;
      window.uiPrefs.decreaseFont();
      syncFontLabel();
    });
  }

  if (fontPlus) {
    fontPlus.addEventListener('click', () => {
      if (!window.uiPrefs) return;
      window.uiPrefs.increaseFont();
      syncFontLabel();
    });
  }

  if (fontReset) {
    fontReset.addEventListener('click', () => {
      if (!window.uiPrefs) return;
      window.uiPrefs.resetFont();
      syncFontLabel();
    });
  }

  if (motionToggle) {
    motionToggle.addEventListener('change', () => {
      if (!window.uiPrefs) return;
      window.uiPrefs.setMotion(motionToggle.checked ? 'reduced' : 'normal');
    });
  }

  // Default tab
  setTab('help');
})();
