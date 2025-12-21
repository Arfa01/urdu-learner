// public/js/stage-success.js
(function () {
  function clampInt(n, min, max, fallback) {
    const x = Number(n);
    if (!Number.isFinite(x)) return fallback;
    return Math.max(min, Math.min(max, Math.round(x)));
  }

  function ensureEl() {
    let el = document.getElementById('stageSuccess');
    if (!el) {
      el = document.createElement('div');
      el.id = 'stageSuccess';
      el.className = 'stage-success';
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
    }
    return el;
  }

  function renderStars(stars) {
    const s = clampInt(stars, 0, 3, 0);
    const items = [0, 1, 2].map((i) => {
      const filled = i < s ? 'is-filled' : '';
      return `
        <div class="giant-star ${filled}" data-i="${i}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.5l2.95 6.27 6.92.64-5.22 4.56 1.55 6.73L12 17.98 5.8 20.7l1.55-6.73L2.13 9.41l6.92-.64L12 2.5z"/>
          </svg>
        </div>
      `;
    });
    return items.join('');
  }

  function show(opts) {
    const el = ensureEl();

    const title = String(opts?.title || 'Stage Clear!');
    const subtitle = String(opts?.subtitle || 'Nice work.');
    const stars = clampInt(opts?.stars, 0, 3, 3);

    const primaryLabel = String(opts?.primaryLabel || 'Continue');
    const primaryHref = opts?.primaryHref ? String(opts.primaryHref) : '';

    const secondaryLabel = String(opts?.secondaryLabel || 'Close');
    const secondaryHref = opts?.secondaryHref ? String(opts.secondaryHref) : '';

    el.innerHTML = `
      <div class="stage-success-backdrop" data-close></div>
      <div class="stage-success-card" role="dialog" aria-modal="true">
        <div class="stage-success-top">
          <div class="stage-success-title">${escapeHtml(title)}</div>
          <button class="icon-btn icon-btn-small" type="button" aria-label="Close" data-close>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>

        <div class="stage-success-subtitle">${escapeHtml(subtitle)}</div>

        <div class="stage-stars">
          ${renderStars(stars)}
        </div>

        <div class="stage-success-actions">
          ${primaryHref ? `<a class="btn btn-primary" href="${escapeAttr(primaryHref)}">${escapeHtml(primaryLabel)}</a>` : `<button class="btn btn-primary" type="button" data-primary>${escapeHtml(primaryLabel)}</button>`}
          ${secondaryHref ? `<a class="btn" href="${escapeAttr(secondaryHref)}">${escapeHtml(secondaryLabel)}</a>` : `<button class="btn" type="button" data-close>${escapeHtml(secondaryLabel)}</button>`}
        </div>
      </div>
    `;

    el.setAttribute('aria-hidden', 'false');
    el.classList.add('show');

    // Animate stars sequentially
    const starEls = Array.from(el.querySelectorAll('.giant-star'));
    starEls.forEach((s, i) => {
      setTimeout(() => s.classList.add('pop'), 180 + i * 220);
    });

    const closeEls = Array.from(el.querySelectorAll('[data-close]'));
    closeEls.forEach((c) => c.addEventListener('click', hide, { once: true }));

    const primaryBtn = el.querySelector('[data-primary]');
    if (primaryBtn && typeof opts?.onPrimary === 'function') {
      primaryBtn.addEventListener('click', () => {
        try { opts.onPrimary(); } finally { hide(); }
      });
    } else if (primaryBtn) {
      primaryBtn.addEventListener('click', hide, { once: true });
    }
  }

  function hide() {
    const el = ensureEl();
    el.classList.remove('show');
    el.setAttribute('aria-hidden', 'true');
    // Keep HTML so it can animate out; clear later
    setTimeout(() => {
      if (el.getAttribute('aria-hidden') === 'true') el.innerHTML = '';
    }, 240);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    // minimal for href attr
    return escapeHtml(str).replace(/\s/g, '%20');
  }

  window.stageSuccess = { show, hide };
})();
