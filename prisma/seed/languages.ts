// Seed 22 Indian official languages (Constitution 8th Schedule) + 10 major world languages.
// `enabled: true` only for languages where we currently have translations (en, hi, sa).
// Adding a new language later = flip `enabled` to true once translations are loaded.

import { db } from '../../src/shared/lib/db';

type LangSeed = {
  code: string;
  name: string;
  nativeName: string;
  direction?: 'ltr' | 'rtl';
  isIndian?: boolean;
  enabled?: boolean;
  sortOrder?: number;
};

const languages: LangSeed[] = [
  // ── Indian official scheduled languages (22) ──
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    isIndian: true,
    enabled: true,
    sortOrder: 1,
  },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isIndian: true, enabled: true, sortOrder: 2 },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', isIndian: true, sortOrder: 10 },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isIndian: true, sortOrder: 11 },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', isIndian: true, sortOrder: 12 },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', isIndian: true, sortOrder: 13 },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', isIndian: true, sortOrder: 14 },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', isIndian: true, sortOrder: 15 },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', isIndian: true, sortOrder: 16 },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', isIndian: true, sortOrder: 17 },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', isIndian: true, sortOrder: 18 },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', isIndian: true, sortOrder: 19 },
  { code: 'mni', name: 'Manipuri', nativeName: 'ꯃꯩꯇꯩꯂꯣꯟ', isIndian: true, sortOrder: 20 },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', isIndian: true, sortOrder: 21 },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', isIndian: true, sortOrder: 22 },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', isIndian: true, sortOrder: 23 },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', isIndian: true, sortOrder: 24 },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', isIndian: true, sortOrder: 25 },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي',
    direction: 'rtl',
    isIndian: true,
    sortOrder: 26,
  },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isIndian: true, sortOrder: 27 },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isIndian: true, sortOrder: 28 },
  { code: 'ur', name: 'Urdu', nativeName: 'اُردُو', direction: 'rtl', isIndian: true, sortOrder: 29 },

  // ── Top 10 world languages by speakers (post-Indian) ──
  { code: 'en', name: 'English', nativeName: 'English', enabled: true, sortOrder: 100 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', sortOrder: 101 },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '普通话', sortOrder: 102 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', sortOrder: 103 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', sortOrder: 104 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', sortOrder: 105 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', sortOrder: 106 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', sortOrder: 107 },
  { code: 'fr', name: 'French', nativeName: 'Français', sortOrder: 108 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', sortOrder: 109 },
];

export async function seedLanguages(): Promise<void> {
  for (const lang of languages) {
    await db.language.upsert({
      where: { code: lang.code },
      create: {
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        direction: lang.direction ?? 'ltr',
        enabled: lang.enabled ?? false,
        isIndian: lang.isIndian ?? false,
        sortOrder: lang.sortOrder ?? 100,
      },
      update: {
        name: lang.name,
        nativeName: lang.nativeName,
        direction: lang.direction ?? 'ltr',
        isIndian: lang.isIndian ?? false,
        sortOrder: lang.sortOrder ?? 100,
        // Don't overwrite enabled on update — admin may have toggled in DB
      },
    });
  }
}
