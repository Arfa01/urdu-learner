// seedDatabase.js – single entry-point seeder
// Run with: node seedDatabase.js
//
// Seeds:
// - Lessons (Levels) from lessons_complete.csv
// - Cultural items from seedData.js
// - Context words from seedData.js
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Level = require('./models/Level');
const CulturalItem = require('./models/CulturalItem');
const ContextWord = require('./models/ContextWord');

const { culturalItems, contextWords } = require('./seedData');
const { importLevelsFromCsv } = require('./scripts/importLevelsFromCsv');

function clampInt(n, min, max, fallback) {
  const x = Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(min, Math.min(max, Math.round(x)));
}

async function seedCulture({ reset = false } = {}) {
  if (reset) {
    await CulturalItem.deleteMany({});
  }

  let inserted = 0;
  for (const it of culturalItems || []) {
    const filter = { type: it.type, titleEnglish: it.titleEnglish };
    const res = await CulturalItem.updateOne(filter, { $setOnInsert: it }, { upsert: true });
    if (res.upsertedCount > 0) inserted++;
  }
  return { inserted, reset };
}

async function seedContextWords({ reset = false } = {}) {
  if (reset) {
    await ContextWord.deleteMany({});
  }

  let inserted = 0;
  let updated = 0;

  for (const it of contextWords || []) {
    const existing = await ContextWord.findOne({ wordUrdu: it.wordUrdu });

    if (!existing) {
      await ContextWord.create(it);
      inserted++;
      continue;
    }

    const currentV = clampInt(existing.seedVersion, 0, 1_000_000, 0);
    const nextV = clampInt(it.seedVersion, 0, 1_000_000, 1);

    if (nextV > currentV) {
      await ContextWord.updateOne({ _id: existing._id }, { $set: it });
      updated++;
    }
  }

  return { inserted, updated, reset };
}

async function seedLessons({ reset = false, resetFirst10 = false, repeatMissing = true } = {}) {
  // Keep 50 lessons in UI.
  // Default behavior for lessons_complete.csv (often 1..10): repeat them into 11..50.

  if (reset) {
    await Level.deleteMany({});
  } else if (resetFirst10) {
    await Level.deleteMany({ levelNumber: { $gte: 1, $lte: 10 } });
  }

  const res = await importLevelsFromCsv({
    csvFile: 'lessons_complete.csv',
    dryRun: false,
    // If we're only updating 1..10, do NOT fill/repeat missing (that would overwrite 11..50).
    fillMissing: repeatMissing,
    fillStrategy: repeatMissing ? 'repeat' : 'placeholder',
    connect: false
  });

  return { ...res, reset, resetFirst10, repeatMissing };
}

async function main() {
  const args = process.argv.slice(2);
  const skipLessons = args.includes('--skip-lessons');
  const skipCulture = args.includes('--skip-culture');
  const skipContext = args.includes('--skip-context');

  const resetAll = args.includes('--reset');
  const resetLessons = resetAll || args.includes('--reset-lessons');
  const resetLessonsFirst10 = args.includes('--reset-lessons-first10') || args.includes('--reset-lessons-1-10');
  const updateLessonsFirst10 = args.includes('--update-lessons-first10') || args.includes('--update-lessons-1-10');

  const resetCulture = resetAll || args.includes('--reset-culture');
  const resetContext = resetAll || args.includes('--reset-context');

  await connectDB();

  try {
    const summary = {
      lessons: null,
      culture: null,
      contextWords: null
    };

    if (!skipLessons) {
      console.log('\n📚 Seeding lessons from lessons_complete.csv ...');

      const wantsFirst10Only = updateLessonsFirst10 || resetLessonsFirst10;

      summary.lessons = await seedLessons({
        reset: resetLessons,
        resetFirst10: !resetLessons && resetLessonsFirst10,
        // If updating only 1..10, do not repeat missing into 11..50
        repeatMissing: !wantsFirst10Only
      });
    }

    if (!skipCulture) {
      console.log('\n🕌 Seeding cultural items ...');
      summary.culture = await seedCulture({ reset: resetCulture });
    }

    if (!skipContext) {
      console.log('\n🧩 Seeding context words ...');
      summary.contextWords = await seedContextWords({ reset: resetContext });
    }

    console.log('\n✅ Seeding complete. Summary:');
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await mongoose.connection.close();
  }
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
