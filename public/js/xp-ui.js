// public/js/xp-ui.js
(function () {
  function updatePointsBadge(totalPoints) {
    const el = document.querySelector('.points');
    if (!el) return;
    el.textContent = `${totalPoints} points`;
  }

  function updateRankBadge(rank) {
    const el = document.querySelector('.rank-badge');
    if (!el) return;
    el.textContent = `${rank}`;
    el.dataset.rank = String(rank || 'Bronze');
  }

  function updateStreakBadge(streak) {
    const el = document.querySelector('.streak-badge');
    if (!el) return;
    const n = Number(streak);
    el.textContent = `${Number.isFinite(n) ? n : 0} day streak`;
  }

  function toast(text, variant) {
    const t = document.createElement('div');
    t.className = `xp-toast ${variant || ''}`.trim();
    t.textContent = text;
    document.body.appendChild(t);

    requestAnimationFrame(() => {
      t.classList.add('show');
    });

    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 350);
    }, 1600);
  }

  window.xpUi = { updatePointsBadge, updateRankBadge, updateStreakBadge, toast };
})();
