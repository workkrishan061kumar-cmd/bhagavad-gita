# Deployment

## Environments

| Env | Purpose | URL |
|-----|---------|-----|
| local | Dev | http://localhost:3000 |
| preview | Per-PR | https://gita-verse-pr-N.vercel.app |
| production | Live | TBD |

## First-time setup

1. Create Vercel project, link this GitHub repo.
2. Add env vars in Vercel dashboard (see `.env.example`).
3. Set Vercel project root to repo root (Next.js detected automatically).
4. Production deploy branch: `main`.

## Deploy

- **Preview:** push to a feature branch + open PR. Vercel auto-deploys.
- **Production:** merge PR to `main`. Vercel auto-deploys.

## Rollback

```bash
# Via Vercel CLI
vercel rollback <deployment-url>

# Or via Vercel dashboard: Deployments → ⋯ → Promote to Production
```

## Database migrations in CI

GitHub Action runs `prisma migrate deploy` against production DB on push to `main`.

Manual override:
```bash
DATABASE_URL=<prod-url> npx prisma migrate deploy
```

## Secret rotation

If `NEXTAUTH_SECRET` is leaked:
1. Generate new: `openssl rand -base64 32`
2. Update in Vercel env (production scope only)
3. Trigger redeploy
4. All sessions invalidated — users sign in again

## Incident response

See `docs/runbooks/` for specific scenarios (AI spend spike, DB down).
