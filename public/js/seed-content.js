// ==========================================================
// 📄 seed-content.js - Add Sample Content to Database
// ==========================================================
require('dotenv').config();
const mongoose = require('mongoose');
const MCQ = require('./models/Question');
const Passage = require('./models/Passage');
const Vocabulary = require('./models/Vocabulary');

// Sample MCQs
const sampleMCQs = [
    {
        level: 1,
        question: {
            urdu: 'یہ کیا ہے؟',
            english: 'What is this?'
        },
        options: [
            { urdu: 'کتاب', english: 'Book' },
            { urdu: 'قلم', english: 'Pen' },
            { urdu: 'میز', english: 'Table' },
            { urdu: 'کرسی', english: 'Chair' }
        ],
        correctAnswer: 0,
        explanation: {
            urdu: 'کتاب صحیح جواب ہے',
            english: 'Book is the correct answer'
        },
        category: 'vocabulary',
        difficulty: 'easy'
    },
    {
        level: 1,
        question: {
            urdu: '"سلام" کا مطلب کیا ہے؟',
            english: 'What does "سلام" mean?'
        },
        options: [
            { urdu: 'الوداع', english: 'Goodbye' },
            { urdu: 'ہیلو/خیر مقدم', english: 'Hello/Welcome' },
            { urdu: 'شکریہ', english: 'Thank you' },
            { urdu: 'معذرت', english: 'Sorry' }
        ],
        correctAnswer: 1,
        category: 'vocabulary',
        difficulty: 'easy'
    },
    {
        level: 2,
        question: {
            urdu: 'خالی جگہ پُر کریں: میں _____ جا رہا ہوں۔',
            english: 'Fill in the blank: میں _____ جا رہا ہوں۔'
        },
        options: [
            { urdu: 'گھر', english: 'Home' },
            { urdu: 'گھر کو', english: 'To home' },
            { urdu: 'گھر میں', english: 'In home' },
            { urdu: 'گھر سے', english: 'From home' }
        ],
        correctAnswer: 0,
        explanation: {
            urdu: '"گھر" صحیح ہے کیونکہ "جا رہا ہوں" میں سمت پہلے سے موجود ہے',
            english: '"گھر" is correct because the direction is already in "جا رہا ہوں"'
        },
        category: 'grammar',
        difficulty: 'medium'
    }
];

// Sample Passages
const samplePassages = [
    {
        level: 1,
        title: {
            urdu: 'میرا خاندان',
            english: 'My Family'
        },
        content: {
            urdu: 'میرا نام احمد ہے۔ میرے خاندان میں پانچ افراد ہیں۔ میرے والد، والدہ، ایک بھائی اور ایک بہن ہیں۔ میرے والد ڈاکٹر ہیں۔ میری والدہ استانی ہیں۔ میرا بھائی سکول میں پڑھتا ہے۔ میری بہن چھوٹی ہے۔ ہم سب ایک ساتھ رہتے ہیں۔',
            english: 'My name is Ahmad. There are five people in my family. I have a father, mother, one brother and one sister. My father is a doctor. My mother is a teacher. My brother studies in school. My sister is small. We all live together.'
        },
        comprehensionQuestions: [
            {
                question: {
                    urdu: 'احمد کے خاندان میں کتنے افراد ہیں؟',
                    english: 'How many people are in Ahmad\'s family?'
                },
                options: [
                    { urdu: 'تین', english: 'Three' },
                    { urdu: 'چار', english: 'Four' },
                    { urdu: 'پانچ', english: 'Five' },
                    { urdu: 'چھ', english: 'Six' }
                ],
                correctAnswer: 2,
                type: 'multiple-choice'
            },
            {
                question: {
                    urdu: 'احمد کے والد کیا کرتے ہیں؟',
                    english: 'What does Ahmad\'s father do?'
                },
                options: [
                    { urdu: 'استاد', english: 'Teacher' },
                    { urdu: 'ڈاکٹر', english: 'Doctor' },
                    { urdu: 'انجینئر', english: 'Engineer' },
                    { urdu: 'کاروباری', english: 'Businessman' }
                ],
                correctAnswer: 1,
                type: 'multiple-choice'
            }
        ],
        vocabulary: [
            { word: 'خاندان', meaning: 'Family', example: 'میرا خاندان بہت بڑا ہے' },
            { word: 'والد', meaning: 'Father', example: 'میرے والد ڈاکٹر ہیں' },
            { word: 'والدہ', meaning: 'Mother', example: 'میری والدہ استانی ہیں' }
        ],
        difficulty: 'beginner'
    }
];

// Sample Vocabulary
const sampleVocabulary = [
    {
        level: 1,
        word: {
            urdu: 'کتاب',
            romanUrdu: 'Kitaab',
            english: 'Book'
        },
        partOfSpeech: 'noun',
        examples: [
            { urdu: 'یہ میری کتاب ہے', english: 'This is my book' }
        ],
        category: 'education'
    },
    {
        level: 1,
        word: {
            urdu: 'پانی',
            romanUrdu: 'Paani',
            english: 'Water'
        },
        partOfSpeech: 'noun',
        examples: [
            { urdu: 'مجھے پانی چاہیے', english: 'I need water' }
        ],
        category: 'food-drinks'
    },
    {
        level: 1,
        word: {
            urdu: 'سلام',
            romanUrdu: 'Salaam',
            english: 'Hello/Peace'
        },
        partOfSpeech: 'noun',
        examples: [
            { urdu: 'السلام علیکم', english: 'Peace be upon you' }
        ],
        category: 'greetings'
    }
];

// Connect and seed
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urdu-learner');
        console.log('✅ Connected to MongoDB');

        // Clear existing data (optional - remove if you want to keep existing data)
        // await MCQ.deleteMany({});
        // await Passage.deleteMany({});
        // await Vocabulary.deleteMany({});
        // console.log('🗑️  Cleared existing data');

        // Insert MCQs
        await MCQ.insertMany(sampleMCQs);
        console.log(`✅ Added ${sampleMCQs.length} MCQs`);

        // Insert Passages
        await Passage.insertMany(samplePassages);
        console.log(`✅ Added ${samplePassages.length} passages`);

        // Insert Vocabulary
        await Vocabulary.insertMany(sampleVocabulary);
        console.log(`✅ Added ${sampleVocabulary.length} vocabulary words`);

        console.log('🎉 Database seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();