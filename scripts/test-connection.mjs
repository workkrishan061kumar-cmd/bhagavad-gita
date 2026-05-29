// One-off connection sanity check.
// Run via: npx dotenv -e .env.local -- node scripts/test-connection.mjs
// Never logs the connection string.

import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('FAIL: DATABASE_URL not set');
  process.exit(1);
}
if (url.includes('[YOUR-PASSWORD]')) {
  console.error(
    'FAIL: DATABASE_URL still has [YOUR-PASSWORD] placeholder — replace with actual password',
  );
  process.exit(1);
}

const masked = url.replace(/:[^:@]+@/, ':***@');
console.log(`Connecting via: ${masked.substring(0, 80)}...`);

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  const version = await client.query('SELECT version()');
  console.log('OK Postgres:', version.rows[0].version.split(',')[0]);

  const ext = await client.query('SELECT extname FROM pg_extension ORDER BY extname');
  const exts = ext.rows.map((r) => r.extname);
  console.log('OK Extensions:', exts.join(', '));

  if (exts.includes('vector')) {
    console.log('OK pgvector enabled');
  } else {
    console.error(
      'WARN pgvector NOT enabled — run in Supabase SQL editor: CREATE EXTENSION IF NOT EXISTS vector;',
    );
  }

  const tableCheck = await client.query(
    "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'",
  );
  console.log(`OK Public tables: ${tableCheck.rows[0].count} (expect 0 — schema not migrated yet)`);

  await client.end();
  console.log('\nAll checks passed.');
} catch (err) {
  console.error('FAIL:', err.message);
  await client.end().catch(() => {});
  process.exit(1);
}
