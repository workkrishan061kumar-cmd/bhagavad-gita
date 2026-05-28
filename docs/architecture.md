# Architecture

Full rationale and decisions live in the master plan §16 at:
`C:\Users\Admin\.claude\plans\hi-claude-i-sparkling-gray.md`

Quick reference below.

## Principles

1. **Server-first** — RSC + Server Actions by default. Client Components opt-in at leaves.
2. **Type-safe end-to-end** — Zod schemas as single source of truth.
3. **Feature-scoped folders** — `src/features/verse/`, not `src/components/verse-card.tsx`.
4. **Boundaries enforced by tooling** — cross-feature imports only via barrel `index.ts`.
5. **Observable** — Sentry + Pino + Vercel Analytics from Day 1.

## Layer model per feature

```
features/<name>/
├── components/         # UI (RSC by default, 'use client' at leaves)
├── actions/            # Server Actions (mutation entry points)
├── queries/            # RSC data fetchers (cached with React.cache)
├── ai/                 # (ask-krishna only) embeddings, prompts
├── schemas.ts          # Zod — source of truth
├── repository.ts       # Prisma calls (only this layer touches db.ts)
├── service.ts          # Business logic (auth-agnostic, http-agnostic)
└── index.ts            # Public API — barrel
```

## Server Actions vs Route Handlers

| Use Server Action | Use Route Handler |
|-------------------|-------------------|
| Form mutation | Twilio inbound webhook |
| Bookmark, journal save | Cron job (`/api/cron/*`) |
| Authenticated user write | OG image (`@vercel/og`) |
| Anywhere `revalidatePath` needed | NextAuth callbacks |

## Result pattern

All Server Actions return `Result<T, E>`. Never throw across the boundary.

```ts
import type { Result } from '@/shared/lib/result';

async function action(input: Input): Promise<Result<Output>> {
  if (!auth) return { ok: false, error: 'unauthorized' };
  // ...
  return { ok: true, data };
}
```

## State management

- Server state → server (RSC)
- URL state → `nuqs`
- Form state → React Hook Form + Zod
- Ephemeral UI state → `useState` or Zustand (only cross-component)
- Optimistic UI → TanStack Query (only where it matters)

Default: RSC + Server Actions + `revalidatePath`. Reach for client cache libraries only when you've felt the pain.

## View Transitions

Enabled via `experimental.viewTransition: true`. See `src/shared/view-transitions/DirectionalTransition.tsx`.

Patterns wired:
1. Chapter → verse: shared mandala morph
2. Prev/next verse: directional slides via `addTransitionType('nav-forward'|'nav-back')`
3. Ask Krishna orb morph
4. List reorder (bookmarks, journal)
5. Suspense reveal (Ask Krishna answer)

CSS recipes live in `src/app/globals.css`.

## Observability

| Layer | Tool |
|-------|------|
| Errors | Sentry (5k events/mo free) |
| Logs | Pino (auto-redacts secrets) |
| Web Vitals | Vercel Analytics |
| Product analytics | Plausible/Umami |
| Audit log | Custom DB table |

`console.log` forbidden — use `logger` from `@/shared/lib/logger`.

## Testing

| Layer | Target | Tool |
|-------|--------|------|
| `lib/`, `service.ts`, `repository.ts` | 80%+ | Vitest |
| Server Actions | Smoke + auth gate | Vitest |
| RSC components | Skip unit | Playwright visual |
| Critical client components | Component tests | RTL |
| E2E golden path | 1 test at v1 | Playwright |

## CI/CD

GitHub Actions on every PR: Biome lint + typecheck + test + build. Lighthouse CI gate on perf regressions.

## See also

- [conventions.md](./conventions.md)
- [adr/](./adr/)
