import { cache } from 'react';
import { db } from '@/shared/lib/db';

export const getAllAuthors = cache(async () => {
  return db.author.findMany({
    orderBy: { name: 'asc' },
  });
});

export const getAuthorBySlug = cache(async (slug: string) => {
  return db.author.findUnique({
    where: { slug },
  });
});

/** Authors that have at least one translation in the given language */
export const getAuthorsForLanguage = cache(async (languageCode: string) => {
  return db.author.findMany({
    where: {
      translations: {
        some: { language: { code: languageCode } },
      },
    },
    orderBy: { name: 'asc' },
  });
});
