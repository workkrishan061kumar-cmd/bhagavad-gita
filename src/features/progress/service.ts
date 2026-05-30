/**
 * Streak computation. Days are compared as YYYY-MM-DD strings in the user's
 * configured timezone (TODO: per-user TZ in Phase 2.E; today we use server TZ).
 */
function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function subtractDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() - n);
  return next;
}

/**
 * Walk the user's reading-day history (DESC) and compute the current streak.
 * A streak continues today OR yesterday → today; if the gap is > 1 day the
 * streak is broken.
 */
export function computeCurrentStreak(activeDays: Date[], now: Date = new Date()): number {
  if (activeDays.length === 0) return 0;
  const set = new Set(activeDays.map(dayKey));
  const today = dayKey(now);
  const yesterday = dayKey(subtractDays(now, 1));

  let cursor: Date;
  if (set.has(today)) {
    cursor = now;
  } else if (set.has(yesterday)) {
    cursor = subtractDays(now, 1);
  } else {
    return 0;
  }

  let streak = 0;
  while (set.has(dayKey(cursor))) {
    streak += 1;
    cursor = subtractDays(cursor, 1);
  }
  return streak;
}

/**
 * Walks the full history (DESC sorted) and returns the longest run of
 * consecutive days. Linear time in days.length.
 */
export function computeLongestStreak(activeDays: Date[]): number {
  if (activeDays.length === 0) return 0;
  const set = new Set(activeDays.map(dayKey));
  const sorted = [...activeDays].sort((a, b) => a.getTime() - b.getTime());
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (!prev || !cur) continue;
    const expected = dayKey(new Date(prev.getTime() + 24 * 60 * 60 * 1000));
    if (dayKey(cur) === expected) {
      current += 1;
      if (current > best) best = current;
    } else if (set.has(dayKey(cur))) {
      current = 1;
    }
  }
  return best;
}
