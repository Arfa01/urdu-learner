// public/js/practice-api.js
(function () {
  async function post(url, body) {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.error || data.message || `Request failed: ${resp.status}`);
    return data;
  }

  async function submitCultureQuiz(itemId, correct) {
    return post('/api/practice/culture', { itemId, correct });
  }

  async function submitContextPractice(wordId, mode, correct) {
    return post('/api/practice/context', { wordId, mode, correct });
  }

  window.practiceApi = { submitCultureQuiz, submitContextPractice };
})();
