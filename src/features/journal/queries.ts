import { cache } from 'react';
import { journalRepository } from './repository';

export const listJournalEntries = cache(async (userId: string) => journalRepository.list(userId));

export const getJournalEntry = cache(async (args: { userId: string; id: number }) =>
  journalRepository.findById(args),
);

export const countJournalEntries = cache(async (userId: string) => journalRepository.count(userId));

export const countDaysJournaled = cache(async (userId: string) =>
  journalRepository.countDaysJournaled(userId),
);

export const findLatestEntryForVerse = cache(
  async (args: { userId: string; chapter: number; verse: number }) =>
    journalRepository.findLatestForVerse(args),
);
