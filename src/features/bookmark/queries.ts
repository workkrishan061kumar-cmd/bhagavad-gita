import { cache } from 'react';
import { bookmarkRepository } from './repository';

export const listBookmarks = cache(async (userId: string) => bookmarkRepository.list(userId));

export const countBookmarks = cache(async (userId: string) => bookmarkRepository.count(userId));

export const isBookmarked = cache(
  async (args: { userId: string; chapter: number; verse: number }) => {
    const row = await bookmarkRepository.findByVerse(args);
    return Boolean(row);
  },
);
