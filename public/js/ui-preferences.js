// public/js/ui-preferences.js
(function () {
  const FONT_STEPS = ['sm', 'md', 'lg', 'xl'];

  function safeGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }

  function apply() {
    const theme = safeGet('ui.theme', 'light');
    const font = safeGet('ui.font', 'md');
    const motion = safeGet('ui.motion', 'normal');

    const html = document.documentElement;
    html.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    html.dataset.font = FONT_STEPS.includes(font) ? font : 'md';
    html.dataset.motion = motion === 'reduced' ? 'reduced' : 'normal';
  }

  function setTheme(theme) {
    safeSet('ui.theme', theme === 'dark' ? 'dark' : 'light');
    apply();
  }

  function toggleTheme() {
    const cur = safeGet('ui.theme', 'light');
    setTheme(cur === 'dark' ? 'light' : 'dark');
  }

  function setFont(font) {
    safeSet('ui.font', FONT_STEPS.includes(font) ? font : 'md');
    apply();
  }

  function increaseFont() {
    const cur = safeGet('ui.font', 'md');
    const idx = Math.max(0, FONT_STEPS.indexOf(cur));
    setFont(FONT_STEPS[Math.min(FONT_STEPS.length - 1, idx + 1)]);
  }

  function decreaseFont() {
    const cur = safeGet('ui.font', 'md');
    const idx = Math.max(0, FONT_STEPS.indexOf(cur));
    setFont(FONT_STEPS[Math.max(0, idx - 1)]);
  }

  function resetFont() {
    setFont('md');
  }

  function setMotion(mode) {
    safeSet('ui.motion', mode === 'reduced' ? 'reduced' : 'normal');
    apply();
  }

  // Apply ASAP
  apply();

  window.uiPrefs = {
    apply,
    setTheme,
    toggleTheme,
    setFont,
    increaseFont,
    decreaseFont,
    resetFont,
    setMotion,
    getTheme: () => safeGet('ui.theme', 'light'),
    getFont: () => safeGet('ui.font', 'md'),
    getMotion: () => safeGet('ui.motion', 'normal')
  };
})();
