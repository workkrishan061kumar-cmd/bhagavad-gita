import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Load .env.local first (takes priority), then .env as fallback.
config({ path: '.env.local' });
config({ path: '.env' });

export default defineConfig({
  experimental: { extensions: true },
  schema: 'prisma/schema.prisma',
  // Prisma CLI / migrations use the direct (non-pooled) connection.
  // Runtime PrismaClient uses DATABASE_URL (pooled) via the PG adapter in src/shared/lib/db.ts.
  datasource: {
    url: env('DIRECT_URL'),
  },
  migrations: {
    seed: 'tsx prisma/seed/index.ts',
  },
});
