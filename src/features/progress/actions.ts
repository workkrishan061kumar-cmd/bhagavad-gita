'use server';

import { getSession } from '@/features/auth';
import { logger } from '@/shared/lib/logger';
import { progressRepository } from './repository';
import { recordViewSchema } from './schemas';
import { computeCurrentStreak } from './service';

/**
 * Fire-and-forget verse-view tracker. Called from a client effect on the
 * verse page; failures are logged but never surfaced to the user, because
 * progress tracking should never block reading.
 */
export async function recordVerseView(input: { chapter: number; verse: number }): Promise<void> {
  const session = await getSession();
  if (!session?.user) return;

  const parsed = recordViewSchema.safeParse(input);
  if (!parsed.success) return;

  const userId = session.user.id;
  try {
    await progressRepository.recordView({
      userId,
      chapter: parsed.data.chapter,
      verse: parsed.data.verse,
    });

    // Recompute current streak + bump longestStreak high-water mark.
    const activeDays = await progressRepository.recentReadingDays(userId);
    const current = computeCurrentStreak(activeDays);
    const existing = await progressRepository.getUserStreakState(userId);
    const longest = Math.max(existing?.longestStreak ?? 0, current);
    if (current !== existing?.streakDays || longest !== existing?.longestStreak) {
      await progressRepository.updateStreaks({
        userId,
        streakDays: current,
        longestStreak: longest,
      });
    }
  } catch (err) {
    logger.error({ err, userId, input: parsed.data }, 'recordVerseView failed (non-blocking)');
  }
}
