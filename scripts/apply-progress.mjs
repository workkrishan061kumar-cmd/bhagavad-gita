import { config } from 'dotenv';
import pg from 'pg';

config({ path: '.env.local' });

const { Client } = pg;
const client = new Client({ connectionString: process.env.DIRECT_URL });
await client.connect();

await client.query(`
  ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER NOT NULL DEFAULT 0;
`);
console.log('users.longestStreak ensured.');

await client.query(`
  CREATE TABLE IF NOT EXISTS "verse_views" (
    "userId"   TEXT        NOT NULL,
    "verseId"  INTEGER     NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "verse_views_pkey" PRIMARY KEY ("userId", "verseId")
  );
`);
console.log('verse_views table ensured.');

await client.query(`
  DO $$ BEGIN
    ALTER TABLE "verse_views"
      ADD CONSTRAINT "verse_views_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`);
await client.query(`
  DO $$ BEGIN
    ALTER TABLE "verse_views"
      ADD CONSTRAINT "verse_views_verseId_fkey"
      FOREIGN KEY ("verseId") REFERENCES "verses"("id");
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`);
console.log('verse_views FKs ensured.');

await client.query(`
  CREATE INDEX IF NOT EXISTS "verse_views_userId_viewedAt_idx"
    ON "verse_views" ("userId", "viewedAt");
`);
await client.query(`
  CREATE INDEX IF NOT EXISTS "verse_views_verseId_idx"
    ON "verse_views" ("verseId");
`);
console.log('verse_views indexes ensured.');

await client.query(`
  CREATE TABLE IF NOT EXISTS "reading_days" (
    "userId" TEXT NOT NULL,
    "date"   DATE NOT NULL,
    CONSTRAINT "reading_days_pkey" PRIMARY KEY ("userId", "date")
  );
`);
console.log('reading_days table ensured.');

await client.query(`
  DO $$ BEGIN
    ALTER TABLE "reading_days"
      ADD CONSTRAINT "reading_days_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`);
console.log('reading_days FK ensured.');

await client.query(`
  CREATE INDEX IF NOT EXISTS "reading_days_userId_date_desc_idx"
    ON "reading_days" ("userId", "date" DESC);
`);
console.log('reading_days indexes ensured.');

await client.end();
console.log('Done.');
