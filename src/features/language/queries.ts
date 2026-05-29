import { cache } from 'react';
import { db } from '@/shared/lib/db';

export const getEnabledLanguages = cache(async () => {
  return db.language.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: 'asc' },
  });
});

export const getAllLanguages = cache(async () => {
  return db.language.findMany({
    orderBy: { sortOrder: 'asc' },
  });
});

export const getLanguageByCode = cache(async (code: string) => {
  return db.language.findUnique({
    where: { code },
  });
});
