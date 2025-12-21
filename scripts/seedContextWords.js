// scripts/seedContextWords.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const ContextWord = require('../models/ContextWord');
const { contextWords } = require('../seedData');

async function run() {
  await connectDB();

  try {
    // Upsert without wiping existing user content.
    // If an existing document has seedVersion < seedVersion in seedData.js, we update it.
    let inserted = 0;
    let updated = 0;

    for (const it of contextWords || []) {
      const existing = await ContextWord.findOne({ wordUrdu: it.wordUrdu });

      if (!existing) {
        await ContextWord.create(it);
        inserted++;
        continue;
      }

      const v = Number(existing.seedVersion || 0);
      const next = Number(it.seedVersion || 1);
      if (next > v) {
        await ContextWord.updateOne({ _id: existing._id }, { $set: it });
        updated++;
      }
    }

    console.log(`Seed complete. Inserted: ${inserted}, Updated: ${updated}.`);
  } finally {
    await mongoose.connection.close();
  }
}

run().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
