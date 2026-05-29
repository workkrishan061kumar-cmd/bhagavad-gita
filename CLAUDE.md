# Gita-Verse — Bhagavad Gita Platform

@AGENTS.md

> Quick context for Claude Code sessions working on this repo.
> For deeper docs see `docs/architecture.md` and `docs/conventions.md`.

---

## What this project is

A modern, AI-augmented Bhagavad Gita reading platform. **Free, no ads, no paywall** — donation-supported. Sacred-modern aesthetic (midnight indigo + gold + saffron). India-first audience.

- **Live URL:** https://bhagwad-geeta-phi.vercel.app
- **Repo:** https://github.com/workkrishan061kumar-cmd/bhagavad-gita
- **Phase 0 status:** ✅ Complete and deployed
- **17-week build plan:** `C:\Users\Admin\.claude\plans\hi-claude-i-sparkling-gray.md`

---

## Stack (locked)

- **Next.js 16.2 (App Router + Turbopack)** + **React 19.2** + **TypeScript strict**
- **Tailwind v4** with `@theme` design tokens (no shadcn primitives yet)
- **Prisma 7 + `@prisma/adapter-pg`** against **Supabase Postgres** (Tokyo region `ap-northeast-1`)
- **Supabase Storage** for verse audio (public bucket `recitations`, 77 MB used)
- **Biome 2** (replaces ESLint + Prettier; `noConsole` not `noConsoleLog`)
- **NextAuth v5 beta** installed but not yet wired (Phase 2)
- **Zod 4** + `@t3-oss/env-nextjs` for env validation
- **Pino** for server logging (`console.log` forbidden by lint)
- **Husky + lint-staged + commitlint** (Conventional Commits)
- **npm** (not pnpm — Windows admin permission issue with corepack)

⚠️ **This is Next.js 16, NOT 15.** Some APIs differ — `middleware` → `proxy`, async `params` / `searchParams`, etc. See `node_modules/next/dist/docs/` if uncertain.

---

## Directory structure

```
src/
├── app/                  # Routes ONLY (thin orchestration, RSC by default)
│   ├── page.tsx          # Landing
│   ├── chapters/         # Chapter index
│   ├── chapter/[n]/      # Chapter detail
│   ├── verse/[c]/[v]/    # Verse page (main reading surface)
│   ├── ask/ daily/ search/ situations/ themes/[slug]/
│   ├── library/[slug]/ about/ faqs/ donate/ legal/[doc]/ auth/
│   ├── me/*              # /me, /me/bookmarks, /me/journal/[id], etc.
│   ├── api/              # Server-only routes (none active yet)
│   ├── error.tsx not-found.tsx loading.tsx offline/
│   └── [locale]/         # ⚠️ EMPTY — i18n routing deferred to Phase 1 Week 5
│
├── features/             # 🔑 Feature-scoped modules with barrel exports
│   ├── verse/
│   │   ├── repository.ts    # Prisma queries (raw)
│   │   ├── queries.ts       # RSC wrappers with React.cache
│   │   ├── components/
│   │   │   ├── VerseAudioPlayer.tsx     # Client component, HTML5 audio
│   │   │   └── TranslationPicker.tsx    # Client component, lang+author dropdowns
│   │   └── index.ts         # Public API (only this is imported across features)
│   ├── chapter/ language/ author/        # Same pattern: repository + queries + index
│   └── ask-krishna/ journal/ daily/ search/ library/ auth/ share-card/ whatsapp/
│       └── index.ts         # Stubs — implement when corresponding phase lands
│
├── shared/               # Cross-cutting infra
│   ├── lib/
│   │   ├── db.ts            # Prisma singleton with PG adapter
│   │   ├── env.ts           # t3-env validation
│   │   ├── logger.ts        # Pino + secret redaction
│   │   ├── result.ts        # Result<T, E> discriminated union
│   │   ├── cache.ts         # Upstash Redis wrapper (no creds yet)
│   │   ├── ratelimit.ts     # Upstash rate limiter
│   │   └── cn.ts            # clsx + tailwind-merge
│   ├── design-tokens/{colors,type,motion}.ts
│   ├── components/
│   │   ├── brand/Mandala.tsx       # Parametric SVG generator (drop in anywhere)
│   │   └── layout/{Container,Nav}.tsx
│   ├── view-transitions/DirectionalTransition.tsx
│   ├── styles/                     # (intent — globals.css is in src/app/)
│   └── data/mock-verses.ts         # ⚠️ Still imported by /search /situations /themes /me/*
│
├── server/               # Server-only stuff (auth config, cron handlers)
└── middleware.ts         # (not present — Next 16 calls this `proxy.ts`)

prisma/
├── schema.prisma         # 11-table multi-language schema
├── seed/
│   ├── index.ts          # Idempotent seed orchestrator
│   ├── {languages,authors,chapters,verses,translations}.ts
│   └── data/*.json       # gita/gita public-domain dataset (Unlicense)
└── (no migrations folder — we use `db push` not `migrate dev`)

scripts/
├── test-connection.mjs           # DB smoke check (npm run db:test)
├── update-bucket.mjs             # One-off Supabase Storage bucket config
├── upload-recitations.mjs        # Bulk MP3 upload (npm run db:upload-recitations)
└── verify-recitations.mjs        # Post-upload check

supabase/migrations/01_rls_policies.sql

docs/
├── architecture.md       # System design overview
├── conventions.md        # Code style + naming
├── deployment.md         # How to deploy + rollback
└── adr/
    ├── 0001-server-actions-vs-trpc.md
    └── 0002-db-push-vs-migrate.md
```

---

## How to run

```bash
cd C:\Users\Admin\projects\bhagavad-gita
npm install                       # Triggers postinstall: prisma generate
npm run dev                       # http://localhost:3000 with Turbopack

# Common ops
npm run db:test                   # Smoke check Supabase connection
npm run db:studio                 # Open Prisma Studio
npm run db:push                   # Sync schema to Supabase after schema edits
npm run db:seed                   # Re-seed (idempotent — safe to re-run)
npm run db:upload-recitations     # Re-upload all MP3s (idempotent)

npm run lint                      # Biome check
npm run lint:fix                  # Biome auto-fix
npm run typecheck                 # tsc --noEmit
npm run build                     # Production build (uses real Supabase env)
```

Env vars live in `.env.local` (gitignored). Vercel has them set per environment in the dashboard.

---

## Architecture principles

1. **Server-first** — RSC + Server Actions by default. Client components are leaf-level only (`'use client'` for audio player, picker dropdowns).
2. **Type-safe end-to-end** — Zod schemas as single source of truth. Server Actions return `Result<T, E>`, never throw across boundaries.
3. **Feature-scoped folders** — `src/features/<name>/` with public `index.ts` barrel. Cross-feature imports MUST go through barrels (Biome enforces).
4. **Three-layer backend per feature** — `repository.ts` (Prisma raw) → `service.ts` (business logic) → `actions/*.ts` or `route.ts` (auth + validation + Result). Currently only repository + queries exist; services land with auth in Phase 2.
5. **Observable by default** — `console.log` forbidden. Use `logger` from `@/shared/lib/logger`. Sentry DSN env exists but unset; activate when Phase 8 lands.

---

## Critical gotchas

### Prisma 7
- `url` and `directUrl` are NOT in `schema.prisma` — they live in `prisma.config.ts` under `datasource.url = env('DIRECT_URL')`.
- `PrismaClient` MUST be constructed with `adapter` arg (we use `PrismaPg`). See `src/shared/lib/db.ts`.
- `prisma migrate dev` HANGS against the Supabase Session Pooler. Use `prisma db push` instead. See ADR 0002.
- `postinstall: prisma generate || true` is required for Vercel builds (fresh `npm install` leaves placeholder client).

### Supabase
- Project ref: `pwkpdcnrweoczzckqdpo`
- DATABASE_URL → port 6543 (Transaction pooler with `?pgbouncer=true`)
- DIRECT_URL → port 5432 (Session pooler — also IPv4-compatible, not the truly-direct DB)
- Service role key needed for Storage uploads (set in env as `SUPABASE_SERVICE_ROLE_KEY`)
- pgvector extension enabled. ivfflat index NOT yet created (creates Phase 3 after embeddings).
- RLS enabled on all 11 tables. Our Prisma user has BYPASSRLS so app queries succeed unchanged. Per-user RLS policies (auth.uid()) deferred until Supabase Auth or session-var pattern is added.

### Next.js 16
- `params` and `searchParams` in page components are `Promise<...>` — must `await` them.
- `experimental.viewTransition: true` in next.config.ts enables React's View Transition component but actual navigations don't use it yet.
- Default page export must NOT be a client component for SSG to work.
- Avoid wrapping `npm run build` with `dotenv-cli` — Next auto-loads `.env.local` and the wrapper causes weird prerender failures.

### Project name spelling
- GitHub repo: `bhagavad-gita`
- Vercel project: `bhagwad-geeta` (different spelling — intentional)
- Live URL: `bhagwad-geeta-phi.vercel.app`
- Local folder: `C:\Users\Admin\projects\bhagavad-gita`

### Pages still on mock data
- `src/shared/data/mock-verses.ts` still imported by `/search`, `/situations`, `/situations/[slug]`, `/themes/[slug]`, `/me/bookmarks`, `/me/journal/[id]`, `/me/page.tsx`. They render fine but show fake data. Wired to real DB in later phases.

### Encoding warnings
- Git on Windows shows lots of "LF will be replaced by CRLF" warnings on commit. These are harmless. Don't try to fix.

---

## Code conventions (quick)

- **Components:** `PascalCase.tsx`. Server by default. `'use client'` only when hooks/event handlers/browser APIs are needed.
- **Hooks / utilities:** `useCamelCase.ts` / `kebab-case.ts`.
- **Imports:** Node built-ins → external → `@/*` absolute → relative. No deep imports across features.
- **Comments:** Default to none. Only explain *why*, never *what*. Names should explain *what*.
- **Booleans:** `isFoo`, `hasFoo`, `shouldFoo` — never `foo` for a bool.
- **Server Actions:** Return `Result<T, E>`. Never throw across the boundary.
- **Commits:** Conventional Commits. Scopes: `verse`, `chapter`, `ask`, `daily`, `journal`, `search`, `library`, `auth`, `share`, `whatsapp`, `shared`, `db`, `ci`, `deps`, `docs`, `design`. Enforced by commitlint.

---

## DB schema overview

11 production tables:

```
Content (public-read RLS):
  Language          32 rows — 22 Indian + 10 world (en/hi/sa enabled)
  Author            22 rows — 21 translators + 1 reciter
  Chapter           18 rows — en + hi summaries
  Verse             701 rows — Sanskrit + transliteration + word meanings
                    (Unsupported("vector(1536)") embedding column ready for Phase 3)
  VerseTranslation  4,907 rows — verse × language × author × text + isFeatured
  VerseRecitation   701 rows — verse × reciter × language × audioUrl
  Commentary        0 rows — Phase 1

User (RLS default-deny; Prisma bypasses):
  User Account Session VerificationToken Bookmark JournalEntry MoodLog

AI cache:
  AiQueryCache      0 rows — Phase 3 (semantic question dedup)
```

`Verse.externalId` matches `verse.id` in `prisma/seed/data/verses.json` for stable re-seeding.

---

## What's NOT working yet (functional gaps)

| Surface | Current state |
|---------|--------------|
| Auth (Google + magic link) | UI present, NextAuth not wired |
| Bookmark / Journal write | Buttons present, no Server Actions |
| Ask Krishna AI | Orb renders, no LLM wired |
| Daily mood verse | Selector works, no mood→verse logic |
| Share cards | OG image route not built |
| WhatsApp daily verse | No Twilio integration |
| PDF library | Pages on mock data |
| Search | Pages on mock data; needs Postgres FTS |
| Situations / Themes | Pages on mock data |
| `/me/*` dashboard | All on mock data; needs auth |

---

## When in doubt

1. **Master plan** at `C:\Users\Admin\.claude\plans\hi-claude-i-sparkling-gray.md` — 16 sections covering everything
2. **Progress report** at `C:\Users\Admin\projects\bhagavad-gita-plan\phase-0-progress-report.pdf`
3. **Architecture details** in `docs/architecture.md`
4. **User memory** at `C:\Users\Admin\.claude\projects\C--Users-Admin\memory\` auto-loads

Cost guardrails (master plan §11) are non-negotiable — all ops should preserve $0–20/mo free-tier compatibility.
