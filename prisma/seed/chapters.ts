import { db } from '../../src/shared/lib/db';
import chaptersData from './data/chapters.json' with { type: 'json' };

type RawChapter = {
  chapter_number: number;
  chapter_summary: string;
  chapter_summary_hindi: string;
  id: number;
  image_name: string;
  name: string; // Sanskrit (Devanagari)
  name_meaning: string; // English meaning
  name_translation: string;
  name_transliterated: string; // IAST
  verses_count: number;
};

export async function seedChapters(): Promise<void> {
  const chapters = chaptersData as RawChapter[];
  for (const ch of chapters) {
    await db.chapter.upsert({
      where: { number: ch.chapter_number },
      create: {
        id: ch.chapter_number,
        number: ch.chapter_number,
        titleSa: ch.name.normalize('NFC'),
        titleEn: ch.name_meaning.trim(),
        titleHi: ch.name.normalize('NFC'), // Same Devanagari; Hindi name is the Sanskrit name
        summary: ch.chapter_summary.trim(),
        summaryHi: ch.chapter_summary_hindi.trim(),
        verseCount: ch.verses_count,
      },
      update: {
        titleSa: ch.name.normalize('NFC'),
        titleEn: ch.name_meaning.trim(),
        titleHi: ch.name.normalize('NFC'),
        summary: ch.chapter_summary.trim(),
        summaryHi: ch.chapter_summary_hindi.trim(),
        verseCount: ch.verses_count,
      },
    });
  }
}
