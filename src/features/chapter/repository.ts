import { db } from '@/shared/lib/db';

export const chapterRepository = {
  findByNumber: (number: number) =>
    db.chapter.findUnique({
      where: { number },
    }),

  findAll: () =>
    db.chapter.findMany({
      orderBy: { number: 'asc' },
    }),

  count: () => db.chapter.count(),
};

export type ChapterRecord = NonNullable<Awaited<ReturnType<typeof chapterRepository.findByNumber>>>;
