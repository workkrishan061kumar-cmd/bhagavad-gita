// Apply Phase 1.B FTS migration to Supabase.
// Run via: npx dotenv -e .env.local -- node scripts/apply-fts.mjs

import { readFileSync } from 'node:fs';
import pg from 'pg';

const sql = readFileSync('supabase/migrations/02_fts_search.sql', 'utf8');

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

// Listen for NOTICE messages from PL/pgSQL RAISE NOTICE.
client.on('notice', (msg) => {
  console.log(`[NOTICE] ${msg.message}`);
});

console.log('Applying FTS migration…');
await client.query(sql);
console.log('✓ Migration applied');

// Smoke test: search for a known word.
const test = await client.query(
  `SELECT count(*)::int FROM verse_translations WHERE search_tsv @@ plainto_tsquery('simple', 'fear')`,
);
console.log(`✓ Search for "fear" matches ${test.rows[0].count} translations`);

const test2 = await client.query(
  `SELECT v."chapterId", v.number, vt.text, ts_rank(vt.search_tsv, plainto_tsquery('simple', 'duty')) AS rank
   FROM verse_translations vt JOIN verses v ON v.id = vt."verseId"
   WHERE vt.search_tsv @@ plainto_tsquery('simple', 'duty')
   ORDER BY rank DESC LIMIT 3`,
);
console.log('\nTop 3 hits for "duty":');
for (const row of test2.rows) {
  console.log(
    `  ${row.chapterId}.${row.number} (rank ${row.rank.toFixed(3)}) — ${row.text.substring(0, 80)}…`,
  );
}

await client.end();
