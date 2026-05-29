import pg from 'pg';

const c = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await c.connect();

const count = await c.query('SELECT count(*)::int as c FROM verse_recitations');
console.log('verse_recitations rows:', count.rows[0].c);

const v = await c.query(`
  SELECT vr."audioUrl", a.name as reciter, l.code as lang
  FROM verse_recitations vr
  JOIN verses v ON vr."verseId" = v.id
  JOIN authors a ON vr."reciterId" = a.id
  JOIN languages l ON vr."languageId" = l.id
  WHERE v."chapterId" = 2 AND v.number = 47
`);
console.log('Verse 2.47 recitation:');
console.log(JSON.stringify(v.rows[0], null, 2));

await c.end();

const head = await fetch(v.rows[0].audioUrl, { method: 'HEAD' });
console.log('\nPublic URL HEAD check:');
console.log('  Status:', head.status);
console.log('  Size:', head.headers.get('content-length'), 'bytes');
console.log('  Type:', head.headers.get('content-type'));
