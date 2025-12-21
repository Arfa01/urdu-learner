// CulturalItem model – idioms, stories, and folk tales
const mongoose = require('mongoose');

const CulturalQuizSchema = new mongoose.Schema(
  {
    question: { type: String },
    options: [{ type: String }],
    correctIndex: { type: Number, min: 0 },
    explanation: { type: String }
  },
  { _id: false }
);

const CulturalItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['idiom', 'story', 'folktale'],
      required: true,
      index: true
    },

    titleUrdu: { type: String, required: true },
    titleEnglish: { type: String, required: true },

    // Main content
    urduText: { type: String, required: true },
    englishText: { type: String, required: true },

    // Context / how to use
    contextEnglish: { type: String, default: '' },
    whenToUseEnglish: { type: String, default: '' },

    // Quick examples (optional)
    examples: [
      {
        urdu: { type: String },
        english: { type: String }
      }
    ],

    tags: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },

    // Optional interactive MCQ (e.g., "What does this idiom mean?")
    quiz: CulturalQuizSchema
  },
  { timestamps: true }
);

CulturalItemSchema.index({ type: 1, titleEnglish: 1 });

module.exports = mongoose.model('CulturalItem', CulturalItemSchema);
