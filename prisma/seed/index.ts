// Idempotent seed entry point.
// Run via `npm run db:seed`.
// Add chapter and verse data to data/ and import seeders here.

import { db } from '../../src/shared/lib/db';
import { logger } from '../../src/shared/lib/logger';

async function main() {
  logger.info('Seeding…');
  // TODO: import { seedChapters } from './chapters';
  // TODO: import { seedVerses } from './verses';
  // await seedChapters();
  // await seedVerses();
  logger.info('Seed complete.');
}

main()
  .catch((e) => {
    logger.error({ err: e }, 'Seed failed');
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
