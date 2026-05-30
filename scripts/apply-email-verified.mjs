import { config } from 'dotenv';
import pg from 'pg';

config({ path: '.env.local' });

const { Client } = pg;

const client = new Client({ connectionString: process.env.DIRECT_URL });
await client.connect();

const result = await client.query(`
  ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);
`);

console.log('Added emailVerified to users.', result.command);

await client.end();
