import { db } from '@/shared/lib/db';

export type VerseRef = { chapter: number; verse: number };

export const verseRepository = {
  findByRef: ({ chapter, verse }: VerseRef) =>
    db.verse.findUnique({
      where: { chapterId_number: { chapterId: chapter, number: verse } },
      include: {
        chapter: true,
        translations: {
          include: { author: true, language: true },
          orderBy: [{ language: { sortOrder: 'asc' } }, { isFeatured: 'desc' }],
        },
        recitations: {
          where: { isFeatured: true },
          include: { reciter: true, language: true },
          take: 1,
        },
      },
    }),

  findManyByChapter: (chapterNumber: number) =>
    db.verse.findMany({
      where: { chapterId: chapterNumber },
      include: {
        translations: {
          where: { isFeatured: true, language: { code: 'en' } },
          include: { author: true, language: true },
          take: 1,
        },
      },
      orderBy: { number: 'asc' },
    }),

  findNeighbors: ({ chapter, verse }: VerseRef) =>
    db.verse.findMany({
      where: {
        chapterId: chapter,
        number: { in: [verse - 1, verse + 1] },
      },
      select: { number: true },
      orderBy: { number: 'asc' },
    }),

  countInChapter: (chapterNumber: number) =>
    db.verse.count({ where: { chapterId: chapterNumber } }),
};

export type VerseWithTranslations = NonNullable<
  Awaited<ReturnType<typeof verseRepository.findByRef>>
>;

export type ChapterVersePreview = Awaited<
  ReturnType<typeof verseRepository.findManyByChapter>
>[number];
