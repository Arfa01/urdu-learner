// public/js/lesson-flow.js
(function () {
  const steps = ['words', 'sentences', 'passage', 'mcq'];

  const panels = Array.from(document.querySelectorAll('.assessment-panel'));
  const stepper = document.getElementById('stepper');
  const stepBtns = stepper ? Array.from(stepper.querySelectorAll('.step')) : [];

  const prevBtn = document.getElementById('stepPrev');
  const nextBtn = document.getElementById('stepNext');

  let scores = typeof window.initialUserScores === 'object' && window.initialUserScores
    ? { ...window.initialUserScores }
    : {};

  let currentIdx = 0;

  function computeBadges(totalPercent) {
    if (totalPercent >= 90) return 3;
    if (totalPercent >= 85) return 2;
    if (totalPercent >= 80) return 1;
    return 0;
  }

  function computeTotalPercent(s) {
    const vals = ['words', 'sentences', 'passage', 'mcq']
      .map((k) => s?.[k])
      .filter((v) => typeof v === 'number' && Number.isFinite(v));
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  function idxFromStep(step) {
    const i = steps.indexOf(String(step || '').toLowerCase());
    return i >= 0 ? i : 0;
  }

  function stepFromHash() {
    const h = String(window.location.hash || '').replace('#', '');
    return h && steps.includes(h) ? h : null;
  }

  function setHash(step) {
    const s = String(step);
    if (!s) return;
    if (window.location.hash.replace('#', '') === s) return;
    history.replaceState(null, '', `#${s}`);
  }

  function setActive(idx, opts) {
    const i = Math.max(0, Math.min(steps.length - 1, idx));
    currentIdx = i;

    const step = steps[i];

    // Panels
    panels.forEach((p) => {
      const on = p.dataset.step === step;
      p.classList.toggle('is-active', on);
      p.style.display = on ? 'block' : 'none';
    });

    // Stepper
    stepBtns.forEach((b) => {
      const s = b.dataset.step;
      b.classList.toggle('active', s === step);
      const value = Number(scores?.[s] || 0);
      const done = value >= 70;
      b.classList.toggle('done', done);
    });

    // Prev/next icon buttons
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === steps.length - 1;

    if (!opts?.skipHash) setHash(step);

    // Scroll to top of content
    if (!opts?.noScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function go(delta) {
    setActive(currentIdx + delta);
  }

  function wirePanelButtons() {
    panels.forEach((p) => {
      const next = p.querySelector('[data-next]');
      const skip = p.querySelector('[data-skip]');
      const finish = p.querySelector('[data-finish]');

      if (next) next.addEventListener('click', () => go(+1));
      if (skip) skip.addEventListener('click', () => go(+1));
      if (finish) finish.addEventListener('click', showResults);
    });
  }

  async function refreshProgress() {
    try {
      const resp = await fetch(`/api/lesson-progress/${encodeURIComponent(window.levelNumber)}`);
      const data = await resp.json();
      if (data && data.scores) scores = { ...scores, ...data.scores };
      return scores;
    } catch {
      return scores;
    }
  }

  async function showResults() {
    await refreshProgress();

    const total = computeTotalPercent(scores);
    const stars = computeBadges(total);

    const nextLesson = Number(window.levelNumber) < 50 ? Number(window.levelNumber) + 1 : null;

    if (window.gameSfx) {
      if (stars >= 3) window.gameSfx.levelUp();
      else if (stars >= 1) window.gameSfx.correct();
    }

    if (window.stageSuccess) {
      window.stageSuccess.show({
        title: `Lesson ${window.levelNumber} Complete`,
        subtitle: `Total score: ${total}% • Stars: ${stars}/3`,
        stars,
        primaryLabel: nextLesson ? `Next Lesson (${nextLesson})` : 'Back to Dashboard',
        primaryHref: nextLesson ? `/lesson/${nextLesson}` : '/dashboard',
        secondaryLabel: 'All Lessons',
        secondaryHref: '/lessons'
      });
    } else {
      // Fallback
      alert(`Lesson ${window.levelNumber} complete. Score: ${total}%. Stars: ${stars}/3`);
    }
  }

  function wireTopNav() {
    if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(+1));

    stepBtns.forEach((b) => {
      b.addEventListener('click', () => setActive(idxFromStep(b.dataset.step)));
    });

    window.addEventListener('hashchange', () => {
      const s = stepFromHash();
      if (!s) return;
      setActive(idxFromStep(s), { skipHash: true, noScroll: true });
    });
  }

  function wireScoreEvents() {
    window.addEventListener('lesson:score', async (e) => {
      const type = e?.detail?.assessmentType;
      const score = e?.detail?.score;
      if (type && typeof score === 'number') scores[type] = score;
      setActive(currentIdx, { skipHash: true, noScroll: true });

      // If the server says the lesson is completed, show results button hint
      if (e?.detail?.lessonCompleted) {
        // If we're already on the last step, pop the results modal.
        if (steps[currentIdx] === 'mcq') {
          await showResults();
        }
      }
    });
  }

  function init() {
    // Hide all panels initially; JS will show the active one
    panels.forEach((p) => (p.style.display = 'none'));

    wireTopNav();
    wirePanelButtons();
    wireScoreEvents();

    const initialStep = stepFromHash() || steps[0];
    setActive(idxFromStep(initialStep), { skipHash: true, noScroll: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
