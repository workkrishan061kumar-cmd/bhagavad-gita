# Gita-Verse

> Modern Bhagavad Gita reading platform with AI-powered guidance. Free, no ads, no paywall.

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · Prisma 7 · Supabase (Postgres + pgvector + Auth) · NextAuth v5 · Upstash Redis · OpenAI · Twilio WhatsApp · Sentry · Biome

## Get running in 5 minutes

```bash
# 1. Install
npm install

# 2. Set up env
cp .env.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_SECRET, etc.

# 3. Generate Prisma client and run dev
npm run db:generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Biome lint + format check |
| `npm run lint:fix` | Auto-fix lint + format |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest watch mode |
| `npm run test:run` | Vitest single run |
| `npm run test:e2e` | Playwright E2E |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run db:seed` | Run idempotent seed |
| `npm run db:studio` | Open Prisma Studio |

## Project structure

```
src/
├── app/              # Routes (thin orchestration)
├── features/         # Feature-scoped modules (verse, journal, ask-krishna, ...)
├── shared/           # Cross-cutting components, lib, design tokens
└── server/           # Server-only (auth, jobs)
```

See [`docs/architecture.md`](./docs/architecture.md) for the full architecture rationale.

## Key principles

1. **Server-first.** RSC + Server Actions by default. Client Components are leaf-level.
2. **Type-safe end-to-end.** Zod schemas are the source of truth for DB ↔ API ↔ forms.
3. **Feature-scoped.** Each feature owns its UI, actions, schemas, service, repository.
4. **Boundaries enforced.** Cross-feature imports must go through `index.ts` barrels.
5. **Observable.** Every error reaches Sentry. Structured logging via Pino.

## Documentation

- [`docs/architecture.md`](./docs/architecture.md) — System design
- [`docs/conventions.md`](./docs/conventions.md) — Code conventions
- [`docs/deployment.md`](./docs/deployment.md) — Deploy procedures
- [`docs/adr/`](./docs/adr/) — Architecture Decision Records

## Contributing

Conventional commits enforced. Pre-commit hook runs Biome auto-fix.

```
feat(verse): add word-by-word toggle
fix(ask): handle empty input
docs(readme): clarify env setup
```

## License

Code: MIT. Verse content: public domain.
