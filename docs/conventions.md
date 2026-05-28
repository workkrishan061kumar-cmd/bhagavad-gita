# Code conventions

## File naming

- Components: `PascalCase.tsx` (`VerseCard.tsx`)
- Hooks: `useCamelCase.ts` (`useStreakFlame.ts`)
- Utilities: `kebab-case.ts` (`format-verse-ref.ts`)
- Schemas: always `schemas.ts` inside the feature folder
- Server actions: action name as file (`bookmark.ts` exports `addBookmark`)

## Imports

```ts
// 1. Node built-ins
import { readFile } from 'node:fs/promises';
// 2. External packages
import { z } from 'zod';
// 3. Internal absolute (via @/*)
import { db } from '@/shared/lib/db';
import { VerseCard } from '@/features/verse';
// 4. Relative (only within the same feature)
import { addBookmarkSchema } from './schemas';
```

**Forbidden:** deep imports across features.
- ❌ `import { VerseCard } from '@/features/verse/components/VerseCard'`
- ✅ `import { VerseCard } from '@/features/verse'`

## Server Components by default

Add `'use client'` only when the file needs:
- Hooks (`useState`, `useEffect`, `use`, etc.)
- Browser APIs
- Event handlers (`onClick`, `onChange`)

Push client boundaries as deep into the tree as possible. A page should be a server component composing client leaves, not the other way around.

## Naming

- Booleans: `isFoo`, `hasFoo`, `shouldFoo`. Not `foo` for booleans.
- Async functions: verb-first (`fetchVerse`, `embedQuestion`).
- React events: `onAction` for prop, `handleAction` for internal.
- Constants: `SCREAMING_SNAKE_CASE` only for true constants. Otherwise `camelCase`.

## Components

- No boolean prop proliferation. Use compound components: `<Verse><Verse.Sanskrit /></Verse>`.
- Explicit variant components > `variant` prop when divergence is structural.
- Composition via `children` > render props.

## Server Actions

```ts
'use server';

export async function addBookmark(
  input: AddBookmarkInput,
): Promise<Result<{ id: number }>> {
  const session = await auth();
  if (!session) return { ok: false, error: 'unauthorized' };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const limited = await check(limiters.bookmark, session.user.id);
  if (!limited.ok) return { ok: false, error: 'rate_limited' };

  try {
    const result = await bookmarkService.add(session.user.id, parsed.data);
    return { ok: true, data: { id: result.id } };
  } catch (err) {
    logger.error({ err, userId: session.user.id }, 'addBookmark failed');
    return { ok: false, error: 'server_error' };
  }
}
```

Never `throw` across the boundary. Always return `Result`.

## Comments

- Default to none. Code + names should explain *what*.
- Comments explain *why* — non-obvious constraints, historical context.
- No `// TODO` without an issue link.

## CSS

- Tailwind v4 utilities. No CSS-in-JS.
- Design tokens via `@theme` in globals.css. Custom utilities in `@layer utilities`.
- No magic numbers. Use spacing scale.

## Commits

Conventional Commits enforced by commitlint.

```
feat(verse): add word-by-word toggle
fix(ask): handle empty input gracefully
docs(readme): clarify env setup
chore(deps): bump prisma to 7.9
```

Scopes: `verse`, `chapter`, `ask`, `daily`, `journal`, `search`, `library`, `auth`, `share`, `whatsapp`, `shared`, `db`, `ci`, `deps`, `docs`, `design`.
