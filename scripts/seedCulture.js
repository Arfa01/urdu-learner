// scripts/seedCulture.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const CulturalItem = require('../models/CulturalItem');
const { culturalItems } = require('../seedData');

async function run() {
  await connectDB();

  try {
    let inserted = 0;

    for (const it of culturalItems || []) {
      // Stable-ish unique key
      const filter = { type: it.type, titleEnglish: it.titleEnglish };
      const res = await CulturalItem.updateOne(filter, { $setOnInsert: it }, { upsert: true });
      if (res.upsertedCount > 0) inserted++;
    }

    console.log(`Seed complete. Inserted: ${inserted}.`);
  } finally {
    await mongoose.connection.close();
  }
}

run().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
