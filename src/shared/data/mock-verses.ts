// Mock verse data for v1 screen scaffolding.
// Replace with Prisma queries once DB is seeded.

export type MockVerse = {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  english: string;
  hindi: string;
  themes: string[];
  moods: string[];
};

export const mockVerses: Record<string, MockVerse> = {
  '2.47': {
    chapter: 2,
    verse: 47,
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    transliteration:
      "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||",
    english:
      'You have a right to perform your prescribed duty, but you are not entitled to the fruits of your action. Never consider yourself the cause of the results of your activities, nor be attached to inaction.',
    hindi:
      'तुम्हारा अधिकार केवल कर्म करने में है, फलों में कभी नहीं। तुम कर्मों के फल का हेतु मत बनो और न ही अकर्म में तुम्हारी आसक्ति हो।',
    themes: ['duty', 'detachment', 'action', 'karma'],
    moods: ['anxious', 'motivated', 'confused'],
  },
  '18.66': {
    chapter: 18,
    verse: 66,
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    transliteration:
      'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja | ahaṁ tvā sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||',
    english:
      'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.',
    hindi: 'सब धर्मों को त्यागकर तू केवल मेरी शरण में आ। मैं तुझे सब पापों से मुक्त कर दूंगा, शोक मत कर।',
    themes: ['surrender', 'faith', 'liberation'],
    moods: ['lost', 'grieving'],
  },
  '2.14': {
    chapter: 2,
    verse: 14,
    sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
    transliteration:
      "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ | āgamāpāyino 'nityās tāṁs titikṣasva bhārata ||",
    english:
      'O son of Kunti, the contact between the senses and the sense objects gives rise to fleeting perceptions of happiness and distress. These are non-permanent, and come and go like the winter and summer seasons. Endure them, O Bhārata.',
    hindi:
      'हे कुन्तीपुत्र, इन्द्रियों और उनके विषयों का संयोग शीत और उष्ण, सुख और दुःख देता है। ये अनित्य हैं, आते-जाते हैं। इन्हें सहन करो।',
    themes: ['endurance', 'equanimity', 'impermanence'],
    moods: ['anxious', 'grieving', 'peaceful'],
  },
};

export const mockChapters = [
  {
    number: 1,
    titleSa: 'अर्जुनविषादयोग',
    titleEn: "Arjuna's Dilemma",
    verseCount: 47,
    summary: 'On the field of Kurukshetra, Arjuna sees his kin arrayed and his resolve collapses.',
  },
  {
    number: 2,
    titleSa: 'सांख्ययोग',
    titleEn: 'Yoga of Knowledge',
    verseCount: 72,
    summary:
      'Krishna begins his teaching: the self is eternal, action without attachment is the way.',
  },
  {
    number: 3,
    titleSa: 'कर्मयोग',
    titleEn: 'Yoga of Action',
    verseCount: 43,
    summary: 'On selfless action and the necessity of work performed without ego.',
  },
  {
    number: 4,
    titleSa: 'ज्ञानकर्मसंन्यासयोग',
    titleEn: 'Yoga of Knowledge and Renunciation',
    verseCount: 42,
    summary: 'The eternal lineage of yoga, and how action and renunciation unify.',
  },
  {
    number: 5,
    titleSa: 'कर्मसंन्यासयोग',
    titleEn: 'Yoga of Renunciation',
    verseCount: 29,
    summary: 'Comparing the path of action with the path of renunciation.',
  },
  {
    number: 6,
    titleSa: 'ध्यानयोग',
    titleEn: 'Yoga of Meditation',
    verseCount: 47,
    summary: 'The disciplines of meditation: posture, breath, and steady mind.',
  },
  {
    number: 7,
    titleSa: 'ज्ञानविज्ञानयोग',
    titleEn: 'Yoga of Knowledge and Wisdom',
    verseCount: 30,
    summary: 'On the divine nature and the path to know the absolute.',
  },
  {
    number: 8,
    titleSa: 'अक्षरब्रह्मयोग',
    titleEn: 'Yoga of the Imperishable',
    verseCount: 28,
    summary: "On death, the soul's journey, and the supreme imperishable.",
  },
  {
    number: 9,
    titleSa: 'राजविद्याराजगुह्ययोग',
    titleEn: 'Yoga of Royal Knowledge',
    verseCount: 34,
    summary: 'The most secret knowledge: devotion as the highest path.',
  },
  {
    number: 10,
    titleSa: 'विभूतियोग',
    titleEn: 'Yoga of Divine Manifestations',
    verseCount: 42,
    summary: 'Krishna lists his manifestations across the world.',
  },
  {
    number: 11,
    titleSa: 'विश्वरूपदर्शनयोग',
    titleEn: 'Vision of the Universal Form',
    verseCount: 55,
    summary: 'Krishna reveals his cosmic form to Arjuna.',
  },
  {
    number: 12,
    titleSa: 'भक्तियोग',
    titleEn: 'Yoga of Devotion',
    verseCount: 20,
    summary: 'The path of devotion and the qualities of the devotee.',
  },
  {
    number: 13,
    titleSa: 'क्षेत्रक्षेत्रज्ञविभागयोग',
    titleEn: 'Yoga of the Field and the Knower',
    verseCount: 35,
    summary: 'On the body as the field and the soul as the knower.',
  },
  {
    number: 14,
    titleSa: 'गुणत्रयविभागयोग',
    titleEn: 'Yoga of the Three Qualities',
    verseCount: 27,
    summary: 'The three modes of material nature: goodness, passion, ignorance.',
  },
  {
    number: 15,
    titleSa: 'पुरुषोत्तमयोग',
    titleEn: 'Yoga of the Supreme Person',
    verseCount: 20,
    summary: 'The cosmic tree, the supreme person, and the path beyond.',
  },
  {
    number: 16,
    titleSa: 'दैवासुरसम्पद्विभागयोग',
    titleEn: 'Yoga of Divine and Demonic Natures',
    verseCount: 24,
    summary: 'Two natures within humanity: the divine and the demonic.',
  },
  {
    number: 17,
    titleSa: 'श्रद्धात्रयविभागयोग',
    titleEn: 'Yoga of Three Kinds of Faith',
    verseCount: 28,
    summary: 'On faith and how it shapes worship, food, sacrifice.',
  },
  {
    number: 18,
    titleSa: 'मोक्षसंन्यासयोग',
    titleEn: 'Yoga of Liberation',
    verseCount: 78,
    summary: 'The summation: do your duty, surrender, and be free.',
  },
];

export type MockChapter = (typeof mockChapters)[number];
