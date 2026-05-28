# ADR 0001: Server Actions + Route Handlers (no tRPC at v1)

**Status:** Accepted · **Date:** 2026-05-28

## Context

We need typed mutations from React components to the server. Options considered:

1. **Server Actions + Route Handlers** (Next.js native)
2. **tRPC layer** over Route Handlers
3. **REST endpoints + manual types**

## Decision

Use Server Actions for mutations (forms, bookmarks, journal saves). Use Route Handlers only for: webhooks (Twilio), cron jobs (Vercel Cron), OG image generation, NextAuth callbacks.

## Rationale

- Server Actions provide end-to-end TypeScript types natively in the App Router.
- Zod schemas at the action input give runtime validation + inferred types.
- `revalidatePath()` ergonomics beat tRPC's manual cache invalidation.
- Less ceremony, faster to ship for a solo developer.
- No separate API layer to maintain.
- A future mobile app can add tRPC then — but at v1 web-only, it's overhead.

## Consequences

- All mutations go through `'use server'` actions with a `Result<T, E>` return type.
- No router file. Each feature owns its `actions/` folder.
- If we add a native mobile app or third-party API in v2, we'll layer tRPC then.

## Revisit when

- We have a mobile client OR
- A third party needs to call our API OR
- The team grows past 3 developers (formal contracts help coordination)
