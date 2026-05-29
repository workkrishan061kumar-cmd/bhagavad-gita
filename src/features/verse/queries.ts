import { cache } from 'react';
import { type VerseRef, verseRepository } from './repository';

export const getVerse = cache(async (ref: VerseRef) => {
  return verseRepository.findByRef(ref);
});

export const getVersesInChapter = cache(async (chapter: number) => {
  return verseRepository.findManyByChapter(chapter);
});

export const getNeighborVerses = cache(async (ref: VerseRef) => {
  const rows = await verseRepository.findNeighbors(ref);
  const prev = rows.find((r) => r.number === ref.verse - 1)?.number;
  const next = rows.find((r) => r.number === ref.verse + 1)?.number;
  return { prev, next };
});
