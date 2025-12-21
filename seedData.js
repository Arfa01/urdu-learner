// Seed data generator for cultural items, context words, and vocabulary.
// Run with: node seedData.js
const fs = require('fs');

// 1) Cultural items (idioms, stories, folktales)
const culturalItems = [
  // ========== BEGINNER IDIOMS ==========
  {
    type: 'idiom',
    titleUrdu: 'آنکھوں میں دھول جھونکنا',
    titleEnglish: 'Aankhon mein dhool jhonkna',
    urduText: 'آنکھوں میں دھول جھونکنا',
    englishText: 'To throw dust in someone\'s eyes (to deceive or mislead)',
    contextEnglish: 'Used when someone tries to trick or fool another person',
    whenToUseEnglish: 'Use in casual conversation when talking about deception or being misled',
    examples: [
      {
        urdu: 'وہ میری آنکھوں میں دھول جھونک رہا تھا',
        english: 'He was trying to deceive me'
      }
    ],
    tags: ['deception', 'common', 'everyday'],
    difficulty: 'beginner',
    quiz: {
      question: 'What does "آنکھوں میں دھول جھونکنا" mean?',
      options: [
        'To clean eyes',
        'To deceive someone',
        'To see clearly',
        'To wear glasses'
      ],
      correctIndex: 1,
      explanation: 'This idiom literally means throwing dust in eyes, but figuratively means to deceive or mislead someone'
    }
  },
  {
    type: 'idiom',
    titleUrdu: 'ہاتھ پر ہاتھ دھرے بیٹھنا',
    titleEnglish: 'Haath par haath dhare baithna',
    urduText: 'ہاتھ پر ہاتھ دھرے بیٹھنا',
    englishText: 'To sit with hands folded (to be idle)',
    contextEnglish: 'Describes someone who is not doing anything productive',
    whenToUseEnglish: 'Use when criticizing laziness or inaction',
    examples: [
      {
        urdu: 'تم ہاتھ پر ہاتھ دھرے کیوں بیٹھے ہو؟',
        english: 'Why are you sitting idle?'
      }
    ],
    tags: ['laziness', 'work', 'common'],
    difficulty: 'beginner'
  },
  {
    type: 'idiom',
    titleUrdu: 'منہ میں پانی آنا',
    titleEnglish: 'Munh mein pani aana',
    urduText: 'منہ میں پانی آنا',
    englishText: 'Mouth watering (to feel hungry seeing delicious food)',
    contextEnglish: 'Used when food looks or smells so good that you feel hungry',
    whenToUseEnglish: 'Perfect for talking about appetizing food',
    examples: [
      {
        urdu: 'بریانی دیکھ کر میرے منہ میں پانی آ گیا',
        english: 'Seeing the biryani made my mouth water'
      }
    ],
    tags: ['food', 'hunger', 'everyday'],
    difficulty: 'beginner'
  },

  // ========== INTERMEDIATE IDIOMS ==========
  {
    type: 'idiom',
    titleUrdu: 'اونٹ کے منہ میں زیرہ',
    titleEnglish: 'Oont ke munh mein zeera',
    urduText: 'اونٹ کے منہ میں زیرہ',
    englishText: 'Cumin in a camel\'s mouth (a drop in the ocean)',
    contextEnglish: 'Something very small or insufficient compared to what is needed',
    whenToUseEnglish: 'Use when the effort or amount is negligible compared to requirements',
    examples: [
      {
        urdu: 'اتنی چھوٹی تنخواہ تو اونٹ کے منہ میں زیرہ ہے',
        english: 'Such a small salary is just a drop in the ocean'
      }
    ],
    tags: ['insufficiency', 'comparison', 'poetic'],
    difficulty: 'intermediate'
  },
  {
    type: 'idiom',
    titleUrdu: 'آسمان سے گرا کھجور میں اٹکا',
    titleEnglish: 'Aasman se gira khajoor mein atka',
    urduText: 'آسمان سے گرا کھجور میں اٹکا',
    englishText: 'Fell from sky and got stuck in date palm (out of frying pan into fire)',
    contextEnglish: 'Escaping one problem only to face another worse problem',
    whenToUseEnglish: 'Use when someone\'s situation worsens despite trying to improve it',
    examples: [
      {
        urdu: 'نوکری چھوڑی تو کاروبار میں نقصان ہو گیا، آسمان سے گرے کھجور میں اٹکے',
        english: 'Left the job and faced loss in business, jumped from frying pan into fire'
      }
    ],
    tags: ['misfortune', 'problems', 'literary'],
    difficulty: 'intermediate'
  },

  // ========== ADVANCED IDIOMS ==========
  {
    type: 'idiom',
    titleUrdu: 'خرقہ فاختہ ہو جانا',
    titleEnglish: 'Khirqa faakhta ho jana',
    urduText: 'خرقہ فاختہ ہو جانا',
    englishText: 'To become a torn patched cloth (to be utterly defeated or ruined)',
    contextEnglish: 'Describes complete destruction of someone\'s reputation or position',
    whenToUseEnglish: 'Use in formal or literary contexts to describe total defeat',
    examples: [
      {
        urdu: 'بحث میں اس کی دلیل کا خرقہ فاختہ ہو گیا',
        english: 'His argument was completely torn apart in the debate'
      }
    ],
    tags: ['defeat', 'classical', 'literary'],
    difficulty: 'advanced'
  },

  // ========== BEGINNER STORIES ==========
  {
    type: 'story',
    titleUrdu: 'چالاک لومڑی',
    titleEnglish: 'The Clever Fox',
    urduText: 'ایک بار ایک لومڑی بہت بھوکی تھی۔ اس نے ایک درخت پر انگور دیکھے۔ اس نے کودنے کی کوشش کی لیکن انگور اونچے تھے۔ آخر میں لومڑی نے کہا، "یہ انگور کھٹے ہیں۔"',
    englishText: 'Once a fox was very hungry. She saw grapes on a tree. She tried to jump but the grapes were high. Finally the fox said, "These grapes are sour."',
    contextEnglish: 'Classic Aesop\'s fable teaching about making excuses when you can\'t achieve something',
    whenToUseEnglish: 'Reference this when someone makes excuses for their failure',
    examples: [
      {
        urdu: 'وہ انگور کھٹے ہیں کی کہانی کی طرح بہانے بنا رہا ہے',
        english: 'He\'s making excuses like the sour grapes story'
      }
    ],
    tags: ['moral', 'animals', 'children'],
    difficulty: 'beginner'
  },

  // ========== INTERMEDIATE STORY ==========
  {
    type: 'folktale',
    titleUrdu: 'ہیر رانجھا',
    titleEnglish: 'Heer Ranjha',
    urduText: 'ہیر اور رانجھا پنجاب کی مشہور محبت کی کہانی ہے۔ رانجھا ایک خوبصورت نوجوان تھا جو بانسری بجاتا تھا۔ ہیر ایک امیر خاندان کی لڑکی تھی۔ دونوں کو ایک دوسرے سے پیار ہو گیا لیکن ان کے خاندانوں نے مخالفت کی۔',
    englishText: 'Heer and Ranjha is a famous love story from Punjab. Ranjha was a handsome young man who played the flute. Heer was a girl from a wealthy family. Both fell in love but their families opposed.',
    contextEnglish: 'Legendary tragic romance that represents pure love against societal barriers',
    whenToUseEnglish: 'Reference when discussing true love or family opposition to relationships',
    examples: [
      {
        urdu: 'ان کی محبت ہیر رانجھا کی طرح ہے',
        english: 'Their love is like Heer Ranjha'
      }
    ],
    tags: ['romance', 'punjabi', 'classical', 'tragic'],
    difficulty: 'intermediate'
  },

  // ========== ADVANCED FOLKTALE ==========
  {
    type: 'folktale',
    titleUrdu: 'میر تقی میر کا کلام',
    titleEnglish: 'Poetry of Mir Taqi Mir',
    urduText: 'میر تقی میر اردو شاعری کے عظیم ترین شاعروں میں سے ایک تھے۔ ان کا مشہور شعر ہے: "دل کی ویرانی کا کیا مذکور ہے، یہ نگر سو مرتبہ لوٹا گیا۔" یہ شعر دہلی کی تباہی اور دل کی ویرانی کو بیان کرتا ہے۔',
    englishText: 'Mir Taqi Mir was one of the greatest Urdu poets. His famous couplet is: "What to mention of my heart\'s desolation, this city has been plundered a hundred times." This verse describes the devastation of Delhi and the desolation of heart.',
    contextEnglish: 'Classical Urdu poetry reflecting political turmoil and personal anguish of 18th century',
    whenToUseEnglish: 'Use when discussing classical Urdu literature or expressing deep sorrow',
    examples: [
      {
        urdu: 'اس کی حالت میر کے شعر کی طرح ہے',
        english: 'His condition is like Mir\'s poetry'
      }
    ],
    tags: ['classical', 'poetry', 'historical', 'literature'],
    difficulty: 'advanced'
  }
];

// 2) Context words (homophones, multiple meanings)
const contextWords = [
  // ========== BEGINNER ==========
  {
    wordUrdu: 'ٹھیک',
    romanUrdu: 'theek',
    baseEnglish: 'okay/fine/correct',
    senses: [
      {
        labelEnglish: 'Agreement',
        meaningEnglish: 'Okay, alright, agreed',
        contextEnglish: 'Used to show acceptance or agreement',
        register: 'neutral',
        tone: 'neutral',
        usageType: 'literal',
        usageNotesEnglish: 'Most common usage in everyday conversation',
        exampleUrdu: 'ٹھیک ہے، میں آتا ہوں',
        exampleEnglish: 'Okay, I\'m coming',
        tipsEnglish: 'Use this when you agree to do something'
      },
      {
        labelEnglish: 'Health/Wellbeing',
        meaningEnglish: 'Fine, well, healthy',
        contextEnglish: 'Referring to someone\'s health or condition',
        register: 'neutral',
        tone: 'polite',
        usageType: 'literal',
        usageNotesEnglish: 'Common in greetings and health inquiries',
        exampleUrdu: 'کیا آپ ٹھیک ہیں؟',
        exampleEnglish: 'Are you okay/fine?',
        tipsEnglish: 'Use when asking about someone\'s wellbeing'
      },
      {
        labelEnglish: 'Correctness',
        meaningEnglish: 'Correct, right, proper',
        contextEnglish: 'Indicating something is accurate or proper',
        register: 'neutral',
        tone: 'neutral',
        usageType: 'literal',
        usageNotesEnglish: 'Used for validation or correction',
        exampleUrdu: 'یہ جواب ٹھیک ہے',
        exampleEnglish: 'This answer is correct',
        tipsEnglish: 'Use when confirming accuracy'
      }
    ],
    scenarios: [
      {
        promptEnglish: 'Your friend asks if you want to go to the movies',
        promptUrdu: 'آپ کا دوست پوچھتا ہے کیا آپ سینما جانا چاہتے ہیں',
        correctSenseIndex: 0,
        explanationEnglish: 'Here ٹھیک means "okay/agreed" showing acceptance'
      },
      {
        promptEnglish: 'Someone fell down and you ask about their condition',
        promptUrdu: 'کوئی گر گیا اور آپ ان کی حالت کے بارے میں پوچھتے ہیں',
        correctSenseIndex: 1,
        explanationEnglish: 'Here ٹھیک means "fine/okay" referring to health'
      }
    ],
    tags: ['common', 'multipurpose', 'essential'],
    difficulty: 'beginner'
  },
  {
    wordUrdu: 'کر',
    romanUrdu: 'kar',
    baseEnglish: 'do/make/after',
    senses: [
      {
        labelEnglish: 'Action Verb',
        meaningEnglish: 'To do, to make',
        contextEnglish: 'Main verb indicating an action',
        register: 'neutral',
        tone: 'neutral',
        usageType: 'literal',
        exampleUrdu: 'کام کر',
        exampleEnglish: 'Do the work',
        tipsEnglish: 'Used as the primary action verb'
      },
      {
        labelEnglish: 'Sequential Action',
        meaningEnglish: 'After doing, having done',
        contextEnglish: 'Indicates one action followed by another',
        register: 'neutral',
        tone: 'neutral',
        usageType: 'literal',
        exampleUrdu: 'کھانا کھا کر آنا',
        exampleEnglish: 'Come after eating',
        tipsEnglish: 'Connect two sequential actions'
      }
    ],
    tags: ['verb', 'essential', 'grammar'],
    difficulty: 'beginner'
  },

  // ========== INTERMEDIATE ==========
  {
    wordUrdu: 'حال',
    romanUrdu: 'haal',
    baseEnglish: 'condition/state/present time',
    senses: [
      {
        labelEnglish: 'Condition/State',
        meaningEnglish: 'Condition, state, situation',
        contextEnglish: 'Referring to someone\'s current condition',
        register: 'formal',
        tone: 'polite',
        usageType: 'literal',
        usageNotesEnglish: 'Common in polite inquiries',
        exampleUrdu: 'آپ کا حال کیسا ہے؟',
        exampleEnglish: 'How are you? (How is your condition?)',
        tipsEnglish: 'More formal than "کیا حال ہے"'
      },
      {
        labelEnglish: 'Present Time',
        meaningEnglish: 'Present, current time, now',
        contextEnglish: 'Temporal reference to the present',
        register: 'formal',
        tone: 'neutral',
        usageType: 'literal',
        exampleUrdu: 'حال میں کیا ہو رہا ہے؟',
        exampleEnglish: 'What\'s happening currently?',
        tipsEnglish: 'Similar to "ابھی" or "اب"'
      },
      {
        labelEnglish: 'Ecstasy/Trance',
        meaningEnglish: 'State of spiritual ecstasy',
        contextEnglish: 'Sufi/spiritual context describing mystical state',
        register: 'formal',
        tone: 'neutral',
        usageType: 'figurative',
        exampleUrdu: 'صوفی حال میں تھا',
        exampleEnglish: 'The Sufi was in a state of ecstasy',
        tipsEnglish: 'Used in spiritual or poetic contexts'
      }
    ],
    scenarios: [
      {
        promptEnglish: 'Meeting an elder and asking about their wellbeing',
        correctSenseIndex: 0,
        explanationEnglish: 'Use حال for polite inquiry about condition'
      }
    ],
    tags: ['formal', 'multipurpose', 'cultural'],
    difficulty: 'intermediate'
  },
  {
    wordUrdu: 'دل',
    romanUrdu: 'dil',
    baseEnglish: 'heart',
    senses: [
      {
        labelEnglish: 'Physical Heart',
        meaningEnglish: 'The heart organ',
        contextEnglish: 'Literal anatomical reference',
        register: 'neutral',
        tone: 'neutral',
        usageType: 'literal',
        exampleUrdu: 'اس کا دل بہت تیز دھڑک رہا ہے',
        exampleEnglish: 'His heart is beating very fast',
        tipsEnglish: 'Medical or physical context'
      },
      {
        labelEnglish: 'Emotions/Feelings',
        meaningEnglish: 'Heart as center of emotions',
        contextEnglish: 'Emotional or romantic context',
        register: 'informal',
        tone: 'neutral',
        usageType: 'figurative',
        exampleUrdu: 'میرا دل ٹوٹ گیا',
        exampleEnglish: 'My heart broke (I was heartbroken)',
        tipsEnglish: 'Most common usage in everyday speech'
      },
      {
        labelEnglish: 'Desire/Wish',
        meaningEnglish: 'Wish, desire, inclination',
        contextEnglish: 'Expressing wants or preferences',
        register: 'informal',
        tone: 'neutral',
        usageType: 'idiomatic',
        exampleUrdu: 'دل چاہتا ہے باہر جاؤں',
        exampleEnglish: 'I feel like going out (My heart wants to go out)',
        tipsEnglish: 'Expresses inner desires'
      }
    ],
    tags: ['emotions', 'common', 'poetic'],
    difficulty: 'intermediate'
  },

  // ========== ADVANCED ==========
  {
    wordUrdu: 'ادب',
    romanUrdu: 'adab',
    baseEnglish: 'literature/respect/manners',
    senses: [
      {
        labelEnglish: 'Literature',
        meaningEnglish: 'Literature, literary works',
        contextEnglish: 'Academic or intellectual discourse',
        register: 'formal',
        tone: 'neutral',
        usageType: 'literal',
        exampleUrdu: 'اردو ادب بہت مالا مال ہے',
        exampleEnglish: 'Urdu literature is very rich',
        tipsEnglish: 'Used in academic contexts'
      },
      {
        labelEnglish: 'Respect/Etiquette',
        meaningEnglish: 'Respect, manners, etiquette',
        contextEnglish: 'Social and cultural behavioral norms',
        register: 'formal',
        tone: 'polite',
        usageType: 'literal',
        exampleUrdu: 'بڑوں کا ادب کرو',
        exampleEnglish: 'Show respect to elders',
        tipsEnglish: 'Core cultural value in Pakistani society'
      },
      {
        labelEnglish: 'Greeting',
        meaningEnglish: 'Formal greeting (آداب)',
        contextEnglish: 'Traditional Muslim greeting',
        register: 'formal',
        tone: 'polite',
        usageType: 'literal',
        exampleUrdu: 'آداب عرض ہے',
        exampleEnglish: 'Greetings (formal salutation)',
        tipsEnglish: 'Classical formal greeting, still used'
      }
    ],
    tags: ['formal', 'cultural', 'sophisticated'],
    difficulty: 'advanced'
  }
];

// 3) Vocabulary lessons (with example sentences)
const vocabularyLessons = [
  // ========== BEGINNER ==========
  {
    level: 1,
    word: {
      urdu: 'کتاب',
      romanUrdu: 'kitaab',
      english: 'book'
    },
    partOfSpeech: 'noun',
    examples: [
      {
        urdu: 'میں کتاب پڑھتا ہوں',
        english: 'I read a book'
      },
      {
        urdu: 'یہ کتاب دلچسپ ہے',
        english: 'This book is interesting'
      }
    ],
    synonyms: ['کتابچہ'],
    category: 'everyday objects',
    difficulty: 'beginner'
  },
  {
    level: 1,
    word: {
      urdu: 'قلم',
      romanUrdu: 'qalam',
      english: 'pen'
    },
    partOfSpeech: 'noun',
    examples: [
      {
        urdu: 'مجھے ایک قلم چاہیے',
        english: 'I need a pen'
      },
      {
        urdu: 'یہ قلم کام نہیں کر رہا',
        english: 'This pen is not working'
      }
    ],
    category: 'everyday objects',
    difficulty: 'beginner'
  },
  {
    level: 1,
    word: {
      urdu: 'پانی',
      romanUrdu: 'paani',
      english: 'water'
    },
    partOfSpeech: 'noun',
    examples: [
      {
        urdu: 'مجھے پانی پینا ہے',
        english: 'I want to drink water'
      },
      {
        urdu: 'پانی ٹھنڈا ہے',
        english: 'The water is cold'
      }
    ],
    category: 'food and drink',
    difficulty: 'beginner'
  },

  // ========== INTERMEDIATE ==========
  {
    level: 10,
    word: {
      urdu: 'خوابیدہ',
      romanUrdu: 'khwabida',
      english: 'asleep, dormant'
    },
    partOfSpeech: 'adjective',
    examples: [
      {
        urdu: 'بچہ خوابیدہ ہے، شور مت کرو',
        english: 'The child is asleep, don\'t make noise'
      },
      {
        urdu: 'ان کی صلاحیتیں خوابیدہ ہیں',
        english: 'Their talents are dormant'
      }
    ],
    synonyms: ['سویا ہوا', 'نیند میں'],
    antonyms: ['بیدار', 'جاگتا'],
    category: 'descriptive',
    difficulty: 'intermediate'
  },
  {
    level: 10,
    word: {
      urdu: 'کوشش',
      romanUrdu: 'koshish',
      english: 'effort, attempt'
    },
    partOfSpeech: 'noun',
    examples: [
      {
        urdu: 'اس نے بہت کوشش کی لیکن ناکام رہا',
        english: 'He tried very hard but failed'
      },
      {
        urdu: 'کوشش کرنے والوں کی کبھی ہار نہیں ہوتی',
        english: 'Those who try never truly lose'
      }
    ],
    synonyms: ['محنت', 'جدوجہد'],
    category: 'abstract concepts',
    difficulty: 'intermediate'
  },

  // ========== ADVANCED ==========
  {
    level: 20,
    word: {
      urdu: 'استعارہ',
      romanUrdu: 'isti\'aara',
      english: 'metaphor'
    },
    partOfSpeech: 'noun',
    examples: [
      {
        urdu: 'شاعر نے اپنی نظم میں خوبصورت استعارے استعمال کیے',
        english: 'The poet used beautiful metaphors in his poem'
      },
      {
        urdu: 'یہ محض ایک استعارہ ہے، لفظی معنی نہیں',
        english: 'This is merely a metaphor, not literal meaning'
      }
    ],
    category: 'literary terms',
    difficulty: 'advanced'
  },
  {
    level: 20,
    word: {
      urdu: 'تعصب',
      romanUrdu: 'ta\'assub',
      english: 'prejudice, bias'
    },
    partOfSpeech: 'noun',
    examples: [
      {
        urdu: 'معاشرے میں تعصب ختم ہونا چاہیے',
        english: 'Prejudice should be eliminated from society'
      },
      {
        urdu: 'اس کے فیصلے میں تعصب نظر آتا ہے',
        english: 'Bias is visible in his decision'
      }
    ],
    synonyms: ['تنگ نظری', 'جانبداری'],
    antonyms: ['انصاف', 'غیرجانبداری'],
    category: 'social concepts',
    difficulty: 'advanced'
  }
];

// Exports for seed scripts

// ContextWord model supports seedVersion; we default to 2 so we can update seed entries later.
const contextWordsSeed = (contextWords || []).map((w) => ({
  ...w,
  seedVersion: Number.isFinite(w?.seedVersion) ? w.seedVersion : 2
}));

module.exports = {
  culturalItems,
  contextWords: contextWordsSeed,
  vocabularyLessons
};

// Optional: write JSON files when run directly
if (require.main === module) {
  // Save Cultural Items
  fs.writeFileSync('cultural_items_seed.json', JSON.stringify(culturalItems, null, 2), 'utf8');

  // Save Context Words
  fs.writeFileSync('context_words_seed.json', JSON.stringify(contextWordsSeed, null, 2), 'utf8');

  // Save Vocabulary
  fs.writeFileSync('vocabulary_seed.json', JSON.stringify(vocabularyLessons, null, 2), 'utf8');

  console.log('✅ Seed files generated successfully!');
  console.log('📁 Files created:');
  console.log('   - cultural_items_seed.json');
  console.log('   - context_words_seed.json');
  console.log('   - vocabulary_seed.json');
}
