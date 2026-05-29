# ADR 0002: Use `prisma db push` (not `migrate dev`) for v0–v1

**Status:** Accepted · **Date:** 2026-05-29

## Context

Initial schema needed to be applied to Supabase. We tried `prisma migrate dev`
but it hung indefinitely against the Supabase Session Pooler (port 5432). The
Rust-based migration engine could not establish a connection through the
pooler the way the `pg` Node driver could.

The project is on Supabase's Free tier, which routes connections through
the shared pooler endpoint (`aws-1-ap-northeast-1.pooler.supabase.com`). There
is no direct IPv4 connection available without the paid IPv4 add-on.

## Decision

For v0 and through v1 launch, use `prisma db push` to sync the Prisma schema
to Supabase. Skip Prisma migration files.

## Rationale

- `db push` uses a different code path that successfully connects through
  the pooler.
- For a solo, pre-launch project with no users, the loss of migration
  history is acceptable.
- We get full schema sync, foreign keys, indexes, `pgvector` support, etc.
- Prisma still generates the typed client correctly from the schema.

## Consequences

- **No migration files in `prisma/migrations/`** — schema changes are
  applied directly via `npm run db:push`.
- **Schema is the source of truth** — what's in `prisma/schema.prisma`
  is what's in Supabase after a push.
- **No rollback by migration** — to revert, edit the schema and push again.
- **RLS policies live separately** in `supabase/migrations/*.sql` and are
  applied via the connection test script or pasted into Supabase SQL Editor.

## Revisit when

- We have real users on production AND need a controlled migration path
- We move to a paid Supabase tier with direct connection access
- We add Prisma Accelerate or a different deployment topology
- A teammate joins and needs reproducible local DB setup

## Path back to migrations

When ready (likely Phase 8 hardening), use `prisma migrate dev --create-only`
in a clean environment that can reach the direct connection, generate the
baseline migration SQL, commit it, then run `prisma migrate deploy` in CI/CD.
