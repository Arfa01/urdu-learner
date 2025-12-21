// public/js/game-sfx.js – simple game sounds via Web Audio API

(function () {
  let ctx = null;

  function getCtx() {
    if (ctx) return ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    return ctx;
  }

  function envGain(gainNode, t0, attack, release, peak) {
    gainNode.gain.cancelScheduledValues(t0);
    gainNode.gain.setValueAtTime(0.0001, t0);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + release);
  }

  function beep(freq, duration, type, peak) {
    const c = getCtx();
    if (!c) return;

    // Some browsers require a user gesture; resume if suspended
    if (c.state === 'suspended') c.resume().catch(() => {});

    const t0 = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);

    osc.connect(gain);
    gain.connect(c.destination);

    envGain(gain, t0, 0.01, duration, peak ?? 0.12);

    osc.start(t0);
    osc.stop(t0 + 0.02 + duration);
  }

  function chord(freqs, duration, type, peak) {
    const c = getCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume().catch(() => {});

    const t0 = c.currentTime;
    freqs.forEach((f, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(f, t0);
      osc.detune.setValueAtTime((i - 1) * 6, t0);
      osc.connect(gain);
      gain.connect(c.destination);
      envGain(gain, t0, 0.008, duration, (peak ?? 0.09) / freqs.length);
      osc.start(t0);
      osc.stop(t0 + 0.02 + duration);
    });
  }

  function correct() {
    // Bright "win" chime
    chord([523.25, 659.25, 783.99], 0.18, 'triangle', 0.18);
    setTimeout(() => chord([659.25, 880], 0.14, 'triangle', 0.14), 120);
  }

  function wrong() {
    // Low buzzy "oops"
    beep(140, 0.18, 'sawtooth', 0.12);
    setTimeout(() => beep(110, 0.16, 'sawtooth', 0.11), 90);
  }

  function click() {
    beep(900, 0.03, 'square', 0.05);
  }

  function levelUp() {
    chord([392, 523.25, 659.25], 0.22, 'triangle', 0.2);
    setTimeout(() => chord([523.25, 659.25, 783.99], 0.22, 'triangle', 0.2), 160);
  }

  window.gameSfx = {
    correct,
    wrong,
    click,
    levelUp
  };
})();
