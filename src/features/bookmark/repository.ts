import { db } from '@/shared/lib/db';

export const bookmarkRepository = {
  list: (userId: string) =>
    db.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        verse: {
          select: {
            number: true,
            sanskrit: true,
            chapter: { select: { number: true, titleEn: true, titleSa: true } },
            translations: {
              where: { isFeatured: true, language: { code: 'en' } },
              select: { text: true },
              take: 1,
            },
          },
        },
      },
    }),

  count: (userId: string) => db.bookmark.count({ where: { userId } }),

  findByVerse: ({ userId, chapter, verse }: { userId: string; chapter: number; verse: number }) =>
    db.bookmark.findFirst({
      where: { userId, verse: { chapterId: chapter, number: verse } },
      select: { id: true },
    }),

  create: ({
    userId,
    chapter,
    verse,
    note,
  }: {
    userId: string;
    chapter: number;
    verse: number;
    note?: string;
  }) =>
    db.bookmark.create({
      data: {
        user: { connect: { id: userId } },
        verse: {
          connect: { chapterId_number: { chapterId: chapter, number: verse } },
        },
        note,
      },
      select: { id: true },
    }),

  removeByVerse: ({ userId, chapter, verse }: { userId: string; chapter: number; verse: number }) =>
    db.bookmark.deleteMany({
      where: {
        userId,
        verse: { chapterId: chapter, number: verse },
      },
    }),
};

export type BookmarkListItem = Awaited<ReturnType<typeof bookmarkRepository.list>>[number];
