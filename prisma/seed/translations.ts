import { db } from '../../src/shared/lib/db';
import { logger } from '../../src/shared/lib/logger';
import translationsData from './data/translations.json' with { type: 'json' };

type RawTranslation = {
  authorName: string;
  author_id: number;
  description: string;
  id: number;
  lang: string; // 'english' or 'hindi'
  language_id: number;
  verseNumber: number; // global verse_id alias
  verse_id: number; // global verse ID (1-701)
};

// Default "featured" picks per language — the user can override in Settings.
const featuredAuthorByLang: Record<string, string> = {
  english: 'Swami Sivananda',
  hindi: 'Swami Ramsukhdas',
};

const langCodeMap: Record<string, string> = {
  english: 'en',
  hindi: 'hi',
};

export async function seedTranslations(): Promise<void> {
  const translations = translationsData as RawTranslation[];

  // Pre-fetch language and author IDs in a map for O(1) lookup.
  // Explicit types defend against the seed running before `prisma generate` has populated typed client.
  const languages = await db.language.findMany();
  const langByCode = new Map<string, number>(
    languages.map((l: { code: string; id: number }) => [l.code, l.id]),
  );

  const authors = await db.author.findMany();
  const authorByExternalId = new Map<number | null, number>(
    authors.map((a: { externalId: number | null; id: number }) => [a.externalId, a.id]),
  );

  const verses = await db.verse.findMany({ select: { id: true, externalId: true } });
  const verseByExternalId = new Map<number | null, number>(
    verses.map((v: { id: number; externalId: number | null }) => [v.externalId, v.id]),
  );

  let processed = 0;
  let skipped = 0;
  for (const t of translations) {
    const langCode = langCodeMap[t.lang];
    if (!langCode) {
      skipped++;
      continue;
    }
    const languageId = langByCode.get(langCode);
    const authorId = authorByExternalId.get(t.author_id);
    const verseId = verseByExternalId.get(t.verse_id);
    if (!languageId || !authorId || !verseId) {
      skipped++;
      continue;
    }

    const isFeatured = featuredAuthorByLang[t.lang] === t.authorName;

    await db.verseTranslation.upsert({
      where: {
        verseId_authorId_languageId: { verseId, authorId, languageId },
      },
      create: {
        verseId,
        authorId,
        languageId,
        text: t.description.trim(),
        isFeatured,
        source: 'github.com/gita/gita',
      },
      update: {
        text: t.description.trim(),
        isFeatured,
      },
    });
    processed++;
    if (processed % 500 === 0) {
      logger.info(`  Seeded ${processed}/${translations.length} translations…`);
    }
  }

  logger.info(`Translations: ${processed} seeded, ${skipped} skipped`);
}
