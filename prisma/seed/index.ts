// Idempotent seed entry point. Run via `npm run db:seed`.
// Order matters: languages + authors → chapters → verses → translations.

import { db } from '../../src/shared/lib/db';
import { logger } from '../../src/shared/lib/logger';
import { seedAuthors } from './authors';
import { seedChapters } from './chapters';
import { seedLanguages } from './languages';
import { seedTranslations } from './translations';
import { seedVerses } from './verses';

async function main(): Promise<void> {
  logger.info('=== Seeding Gita-Verse database ===');

  const t0 = Date.now();

  logger.info('→ Languages (22 Indian + 10 world)…');
  await seedLanguages();
  logger.info(`  ${await db.language.count()} languages`);

  logger.info('→ Authors (21 from gita repo)…');
  await seedAuthors();
  logger.info(`  ${await db.author.count()} authors`);

  logger.info('→ Chapters (18 with EN + HI summaries)…');
  await seedChapters();
  logger.info(`  ${await db.chapter.count()} chapters`);

  logger.info('→ Verses (701 with Sanskrit + transliteration + word meanings)…');
  await seedVerses();
  logger.info(`  ${await db.verse.count()} verses`);

  logger.info('→ Translations (4,907 records: 7 authors × 701 verses)…');
  await seedTranslations();
  logger.info(`  ${await db.verseTranslation.count()} translations`);

  const elapsed = Math.round((Date.now() - t0) / 1000);
  logger.info(`=== Done in ${elapsed}s ===`);
}

main()
  .catch((err) => {
    logger.error({ err }, 'Seed failed');
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
