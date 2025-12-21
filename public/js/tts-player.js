// public/js/tts-player.js
// Chunked TTS playback helper for Google Translate TTS.
// This avoids failures on long strings (Translate TTS often limits length).

(function () {
  function splitIntoChunks(text, maxLen) {
    const s = String(text || '').trim();
    if (!s) return [];

    const chunks = [];
    let start = 0;

    while (start < s.length) {
      let end = Math.min(s.length, start + maxLen);

      // Try to break on whitespace for nicer chunks
      if (end < s.length) {
        const slice = s.slice(start, end);
        const lastSpace = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('\n'));
        if (lastSpace > Math.max(10, maxLen * 0.6)) {
          end = start + lastSpace;
        }
      }

      const chunk = s.slice(start, end).trim();
      if (chunk) chunks.push(chunk);
      start = end;
    }

    return chunks;
  }

  async function playChunk(chunk, languageCode) {
    const url = `/api/get-tts-audio?text=${encodeURIComponent(chunk)}&languageCode=${encodeURIComponent(languageCode)}`;
    const audio = new Audio(url);

    await new Promise((resolve, reject) => {
      audio.addEventListener('ended', resolve, { once: true });
      audio.addEventListener('error', reject, { once: true });
      audio.play().catch(reject);
    });
  }

  const state = {
    isPlaying: false,
    stopRequested: false
  };

  async function playText(text, opts) {
    const languageCode = (opts && opts.languageCode) ? String(opts.languageCode) : 'ur-PK';
    const maxLen = (opts && Number.isFinite(opts.maxLen)) ? Math.max(60, Math.min(220, opts.maxLen)) : 180;

    if (state.isPlaying) {
      // stop current playback first
      state.stopRequested = true;
      return;
    }

    const chunks = splitIntoChunks(text, maxLen);
    if (chunks.length === 0) return;

    state.isPlaying = true;
    state.stopRequested = false;

    try {
      for (const ch of chunks) {
        if (state.stopRequested) break;
        await playChunk(ch, languageCode);
      }
    } finally {
      state.isPlaying = false;
      state.stopRequested = false;
    }
  }

  function stop() {
    if (!state.isPlaying) return;
    state.stopRequested = true;
  }

  window.ttsPlayer = {
    playText,
    stop
  };
})();
