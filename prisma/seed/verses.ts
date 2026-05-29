import { db } from '../../src/shared/lib/db';
import { logger } from '../../src/shared/lib/logger';
import versesData from './data/verses.json' with { type: 'json' };

type RawVerse = {
  chapter_id: number;
  chapter_number: number;
  externalId: number;
  id: number;
  text: string; // Sanskrit (Devanagari)
  title: string;
  verse_number: number;
  verse_order: number;
  transliteration: string;
  word_meanings: string;
};

export async function seedVerses(): Promise<void> {
  const verses = versesData as RawVerse[];
  let processed = 0;
  for (const v of verses) {
    await db.verse.upsert({
      where: { chapterId_number: { chapterId: v.chapter_number, number: v.verse_number } },
      create: {
        externalId: v.id,
        chapterId: v.chapter_number,
        number: v.verse_number,
        sanskrit: v.text.normalize('NFC').trim(),
        transliteration: v.transliteration.trim(),
        wordMeanings: v.word_meanings.trim(),
        themes: [],
        moods: [],
      },
      update: {
        externalId: v.id,
        sanskrit: v.text.normalize('NFC').trim(),
        transliteration: v.transliteration.trim(),
        wordMeanings: v.word_meanings.trim(),
      },
    });
    processed++;
    if (processed % 100 === 0) {
      logger.info(`  Seeded ${processed}/${verses.length} verses…`);
    }
  }
}
