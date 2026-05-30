import { Prisma } from '@prisma/client';
import { db } from '@/shared/lib/db';

type DaysJournaledRow = { count: bigint };

export const journalRepository = {
  list: (userId: string) =>
    db.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        verse: {
          select: {
            number: true,
            chapter: { select: { number: true } },
          },
        },
      },
    }),

  findById: ({ userId, id }: { userId: string; id: number }) =>
    db.journalEntry.findFirst({
      where: { userId, id },
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

  /**
   * Latest journal entry for a (user, verse) pair. Lets the verse-page CTA
   * link to the existing entry if there already is one, rather than creating
   * duplicates.
   */
  findLatestForVerse: ({
    userId,
    chapter,
    verse,
  }: {
    userId: string;
    chapter: number;
    verse: number;
  }) =>
    db.journalEntry.findFirst({
      where: { userId, verse: { chapterId: chapter, number: verse } },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    }),

  create: ({
    userId,
    chapter,
    verse,
    content,
    mood,
  }: {
    userId: string;
    chapter: number;
    verse: number;
    content: string;
    mood: string | null;
  }) =>
    db.journalEntry.create({
      data: {
        user: { connect: { id: userId } },
        verse: { connect: { chapterId_number: { chapterId: chapter, number: verse } } },
        content,
        mood,
      },
      select: { id: true },
    }),

  update: ({
    userId,
    id,
    content,
    mood,
  }: {
    userId: string;
    id: number;
    content: string;
    mood: string | null;
  }) =>
    db.journalEntry.updateMany({
      where: { userId, id },
      data: { content, mood },
    }),

  remove: ({ userId, id }: { userId: string; id: number }) =>
    db.journalEntry.deleteMany({ where: { userId, id } }),

  count: (userId: string) => db.journalEntry.count({ where: { userId } }),

  /**
   * Count distinct UTC dates the user has journaled on. Drives the
   * "Days journaling" stat tile on /me.
   */
  async countDaysJournaled(userId: string): Promise<number> {
    const rows = await db.$queryRaw<DaysJournaledRow[]>(Prisma.sql`
      SELECT COUNT(DISTINCT DATE("createdAt"))::bigint AS count
      FROM journal_entries
      WHERE "userId" = ${userId}
    `);
    const first = rows[0];
    return first ? Number(first.count) : 0;
  },
};

export type JournalListItem = Awaited<ReturnType<typeof journalRepository.list>>[number];
export type JournalEntryDetail = NonNullable<
  Awaited<ReturnType<typeof journalRepository.findById>>
>;
