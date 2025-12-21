// ContextWord model – polysemous words with senses and scenarios
const mongoose = require('mongoose');

const SenseSchema = new mongoose.Schema(
  {
    labelEnglish: { type: String, required: true },
    meaningEnglish: { type: String, required: true },

    // Meaning context
    contextEnglish: { type: String, default: '' },

    // Usage context
    register: {
      type: String,
      enum: ['neutral', 'formal', 'informal'],
      default: 'neutral'
    },
    tone: {
      type: String,
      enum: ['neutral', 'polite', 'rude'],
      default: 'neutral'
    },
    usageType: {
      type: String,
      enum: ['literal', 'idiomatic', 'figurative', 'slang'],
      default: 'literal'
    },

    usageNotesEnglish: { type: String, default: '' },

    exampleUrdu: { type: String, required: true },
    exampleEnglish: { type: String, required: true },

    tipsEnglish: { type: String, default: '' }
  },
  { _id: false }
);

const ScenarioSchema = new mongoose.Schema(
  {
    promptEnglish: { type: String, required: true },
    // Optional: provide an Urdu version of the situation
    promptUrdu: { type: String, default: '' },
    correctSenseIndex: { type: Number, min: 0 },
    explanationEnglish: { type: String, default: '' }
  },
  { _id: false }
);

const ContextWordSchema = new mongoose.Schema(
  {
    wordUrdu: { type: String, required: true, index: true },
    romanUrdu: { type: String, default: '' },

    // Optional: a broad word gloss (not the sense meanings)
    baseEnglish: { type: String, default: '' },

    senses: {
      type: [SenseSchema],
      validate: [(v) => Array.isArray(v) && v.length > 0, 'At least one sense is required']
    },

    // Scenario-based practice (situation → pick correct sense)
    scenarios: {
      type: [ScenarioSchema],
      default: []
    },

    // Seed version for safely updating starter content.
    seedVersion: {
      type: Number,
      default: 0
    },

    tags: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  },
  { timestamps: true }
);

ContextWordSchema.index({ wordUrdu: 1, difficulty: 1 });

module.exports = mongoose.model('ContextWord', ContextWordSchema);
