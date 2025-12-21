// controllers/practiceController.js
const User = require('../models/User');

function ensureMap(val) {
  if (val && typeof val.get === 'function' && typeof val.set === 'function') return val;
  const m = new Map();
  if (val && typeof val === 'object') {
    for (const [k, v] of Object.entries(val)) m.set(k, v);
  }
  return m;
}

function clampInt(n, min, max, fallback) {
  const x = Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(min, Math.min(max, Math.round(x)));
}

function awardOnce(progressObj, key, points) {
  if (!progressObj || typeof progressObj !== 'object') return { awarded: 0 };
  if (progressObj[key] === true) return { awarded: 0 };
  progressObj[key] = true;
  return { awarded: points };
}

function isoDayUtc(d) {
  return new Date(d).toISOString().slice(0, 10);
}

function computeRank(totalPoints) {
  const p = clampInt(totalPoints, 0, 1000000000, 0);
  if (p >= 800) return 'Gold';
  if (p >= 300) return 'Silver';
  return 'Bronze';
}

function ensurePracticeStats(user) {
  user.practiceStats = user.practiceStats && typeof user.practiceStats === 'object'
    ? user.practiceStats
    : { currentStreak: 0, bestStreak: 0, lastPracticeDay: '', lastDailyBonusDay: '' };

  user.practiceStats.currentStreak = clampInt(user.practiceStats.currentStreak, 0, 1000000, 0);
  user.practiceStats.bestStreak = clampInt(user.practiceStats.bestStreak, 0, 1000000, 0);
  user.practiceStats.lastPracticeDay = String(user.practiceStats.lastPracticeDay || '');
  user.practiceStats.lastDailyBonusDay = String(user.practiceStats.lastDailyBonusDay || '');
}

function applyDailyStreakAndBonus(user, correct) {
  ensurePracticeStats(user);

  const today = isoDayUtc(Date.now());
  const yesterday = isoDayUtc(Date.now() - 24 * 60 * 60 * 1000);

  const prev = user.practiceStats.lastPracticeDay;
  let streak = user.practiceStats.currentStreak;

  // Update streak when day changes
  if (prev !== today) {
    if (prev === yesterday) streak = Math.max(1, streak + 1);
    else streak = 1;

    user.practiceStats.currentStreak = streak;
    user.practiceStats.bestStreak = Math.max(user.practiceStats.bestStreak, streak);
    user.practiceStats.lastPracticeDay = today;
  }

  // Daily bonus XP: awarded once per day on first correct practice
  let dailyBonusAwarded = 0;
  if (correct && user.practiceStats.lastDailyBonusDay !== today) {
    // small but motivating; scales with streak
    dailyBonusAwarded = 8 + Math.min(22, streak * 2);
    user.practiceStats.lastDailyBonusDay = today;
  }

  return {
    today,
    streak: user.practiceStats.currentStreak,
    bestStreak: user.practiceStats.bestStreak,
    dailyBonusAwarded
  };
}

exports.submitCultureQuiz = async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const itemId = String(req.body?.itemId || '').trim();
    const correct = !!req.body?.correct;

    if (!itemId) return res.status(400).json({ error: 'Missing itemId' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.cultureProgress = ensureMap(user.cultureProgress);

    const key = itemId;
    const existing = user.cultureProgress.get(key) || { quizCompleted: false, attempts: 0 };
    existing.attempts = clampInt(existing.attempts, 0, 1000000, 0) + 1;
    existing.lastAttemptAt = new Date();

    let pointsAwarded = 0;

    // Update daily streak + possible daily bonus
    const streakInfo = applyDailyStreakAndBonus(user, correct);

    // Award points only on first correct completion (prevents farming)
    if (correct) {
      const r = awardOnce(existing, 'quizCompleted', 20);
      pointsAwarded += r.awarded;
    }

    existing.lastCorrect = correct;
    user.cultureProgress.set(key, existing);

    const totalAdd = pointsAwarded + (streakInfo.dailyBonusAwarded || 0);
    if (totalAdd > 0) {
      user.totalPoints = clampInt(user.totalPoints, 0, 1000000000, 0) + totalAdd;
    }

    user.rank = computeRank(user.totalPoints);

    await user.save();

    res.json({
      success: true,
      correct,
      pointsAwarded,
      dailyBonusAwarded: streakInfo.dailyBonusAwarded || 0,
      totalPoints: user.totalPoints,
      rank: user.rank,
      streak: {
        current: streakInfo.streak,
        best: streakInfo.bestStreak,
        today: streakInfo.today
      },
      progress: existing
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit culture quiz', message: error.message });
  }
};

exports.submitContextPractice = async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const wordId = String(req.body?.wordId || '').trim();
    const mode = String(req.body?.mode || '').trim();
    const correct = !!req.body?.correct;

    if (!wordId) return res.status(400).json({ error: 'Missing wordId' });
    if (!['meaning', 'scenario', 'duel'].includes(mode)) return res.status(400).json({ error: 'Invalid mode' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.contextWordProgress = ensureMap(user.contextWordProgress);

    // Update daily streak + possible daily bonus
    const streakInfo = applyDailyStreakAndBonus(user, correct);

    const key = wordId;
    const existing = user.contextWordProgress.get(key) || {
      meaningCompleted: false,
      scenarioCompleted: false,
      duelCompleted: false,
      attempts: { meaning: 0, scenario: 0, duel: 0 },
      lastAttemptAt: null
    };

    existing.attempts = existing.attempts && typeof existing.attempts === 'object' ? existing.attempts : { meaning: 0, scenario: 0, duel: 0 };
    existing.attempts[mode] = clampInt(existing.attempts[mode], 0, 1000000, 0) + 1;
    existing.lastAttemptAt = new Date();
    existing.lastCorrect = { ...(existing.lastCorrect || {}), [mode]: correct };

    let pointsAwarded = 0;

    if (correct) {
      // First-time completion per mode
      if (mode === 'meaning') pointsAwarded += awardOnce(existing, 'meaningCompleted', 15).awarded;
      if (mode === 'scenario') pointsAwarded += awardOnce(existing, 'scenarioCompleted', 15).awarded;
      if (mode === 'duel') pointsAwarded += awardOnce(existing, 'duelCompleted', 15).awarded;

      // Bonus when user completes all three modes for the same word
      const allDone = existing.meaningCompleted && existing.scenarioCompleted && existing.duelCompleted;
      if (allDone && existing.allModesBonusAwarded !== true) {
        existing.allModesBonusAwarded = true;
        pointsAwarded += 30;
      }
    }

    user.contextWordProgress.set(key, existing);

    const totalAdd = pointsAwarded + (streakInfo.dailyBonusAwarded || 0);
    if (totalAdd > 0) {
      user.totalPoints = clampInt(user.totalPoints, 0, 1000000000, 0) + totalAdd;
    }

    user.rank = computeRank(user.totalPoints);

    await user.save();

    res.json({
      success: true,
      correct,
      mode,
      pointsAwarded,
      dailyBonusAwarded: streakInfo.dailyBonusAwarded || 0,
      totalPoints: user.totalPoints,
      rank: user.rank,
      streak: {
        current: streakInfo.streak,
        best: streakInfo.bestStreak,
        today: streakInfo.today
      },
      progress: existing
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit context practice', message: error.message });
  }
};

// Bingo practice: award points when a user gets BINGO (per room + mode)
exports.submitBingo = async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const roomCode = String(req.body?.roomCode || '').trim().toUpperCase();
    const mode = String(req.body?.mode || 'vocab').trim();
    const linesCompleted = clampInt(req.body?.linesCompleted, 1, 12, 1);

    if (!roomCode) return res.status(400).json({ error: 'Missing roomCode' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Store simple history on the user so we don't double-award for the same room+mode on the same day
    user.bingoProgress = user.bingoProgress && typeof user.bingoProgress === 'object'
      ? user.bingoProgress
      : {};

    const today = isoDayUtc(Date.now());
    const key = `${today}::${roomCode}::${mode}`;
    const existing = user.bingoProgress[key] || { awarded: false };

    // Daily streak + daily bonus
    const streakInfo = applyDailyStreakAndBonus(user, true);

    let pointsAwarded = 0;
    if (!existing.awarded) {
      existing.awarded = true;
      // Base points depend on mode a little bit
      const base = mode === 'grammar' ? 35 : mode === 'audio' ? 30 : 25;
      const lineBonus = Math.min(3, linesCompleted) * 5;
      pointsAwarded = base + lineBonus;
    }

    user.bingoProgress[key] = existing;

    const totalAdd = pointsAwarded + (streakInfo.dailyBonusAwarded || 0);
    if (totalAdd > 0) {
      user.totalPoints = clampInt(user.totalPoints, 0, 1000000000, 0) + totalAdd;
    }

    user.rank = computeRank(user.totalPoints);

    await user.save();

    res.json({
      success: true,
      pointsAwarded,
      dailyBonusAwarded: streakInfo.dailyBonusAwarded || 0,
      totalPoints: user.totalPoints,
      rank: user.rank,
      streak: {
        current: streakInfo.streak,
        best: streakInfo.bestStreak,
        today: streakInfo.today
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit bingo', message: error.message });
  }
};
