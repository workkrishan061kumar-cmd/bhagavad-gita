import { cache } from 'react';
import { progressRepository } from './repository';
import { computeCurrentStreak, computeLongestStreak } from './service';

export type ProgressStats = {
  versesRead: number;
  chaptersComplete: number;
  currentStreak: number;
  longestStreak: number;
};

export const getProgressStats = cache(async (userId: string): Promise<ProgressStats> => {
  const [versesRead, chaptersComplete, activeDays, persisted] = await Promise.all([
    progressRepository.countVersesRead(userId),
    progressRepository.countChaptersComplete(userId),
    progressRepository.recentReadingDays(userId),
    progressRepository.getUserStreakState(userId),
  ]);

  const liveStreak = computeCurrentStreak(activeDays);
  const computedLongest = Math.max(
    computeLongestStreak(activeDays),
    persisted?.longestStreak ?? 0,
    liveStreak,
  );

  return {
    versesRead,
    chaptersComplete,
    currentStreak: liveStreak,
    longestStreak: computedLongest,
  };
});

export const getMostRecentVerse = cache(async (userId: string) =>
  progressRepository.mostRecentView(userId),
);
