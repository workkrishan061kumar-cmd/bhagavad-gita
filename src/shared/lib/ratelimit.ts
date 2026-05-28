import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from './cache';

type Window = `${number} ${'s' | 'm' | 'h' | 'd'}`;

function build(tokens: number, window: Window): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: true,
  });
}

export const limiters = {
  askKrishnaAnon: build(5, '1 d'),
  askKrishnaAuth: build(20, '1 d'),
  bookmark: build(60, '1 m'),
  journalSave: build(30, '1 m'),
  magicLink: build(3, '15 m'),
};

export async function check(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<{ ok: true } | { ok: false; reason: 'rate_limited' | 'disabled' }> {
  if (!limiter) return { ok: false, reason: 'disabled' };
  const result = await limiter.limit(identifier);
  return result.success ? { ok: true } : { ok: false, reason: 'rate_limited' };
}
