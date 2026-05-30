import { Prisma } from '@prisma/client';
import { db } from '@/shared/lib/db';

type DistinctDayRow = { day: Date };
type ChaptersCompleteRow = { count: bigint };

export const progressRepository = {
  /**
   * Mark this verse as viewed (first time only — composite PK absorbs duplicates),
   * mark today as an active reading day, and bump User.lastReadAt.
   * Runs as a single batched transaction so partial state never leaks.
   */
  async recordView({ userId, chapter, verse }: { userId: string; chapter: number; verse: number }) {
    const verseRow = await db.verse.findUnique({
      where: { chapterId_number: { chapterId: chapter, number: verse } },
      select: { id: true },
    });
    if (!verseRow) return null;

    const now = new Date();
    await db.$transaction([
      db.$executeRaw(Prisma.sql`
        INSERT INTO verse_views ("userId", "verseId", "viewedAt")
        VALUES (${userId}, ${verseRow.id}, ${now})
        ON CONFLICT ("userId", "verseId") DO NOTHING
      `),
      db.$executeRaw(Prisma.sql`
        INSERT INTO reading_days ("userId", "date")
        VALUES (${userId}, CURRENT_DATE)
        ON CONFLICT ("userId", "date") DO NOTHING
      `),
      db.user.update({
        where: { id: userId },
        data: { lastReadAt: now },
      }),
    ]);
    return { verseId: verseRow.id };
  },

  countVersesRead: (userId: string) => db.verseView.count({ where: { userId } }),

  /**
   * A chapter is "complete" when the user has viewed at least as many distinct
   * verses in it as the chapter's verseCount.
   */
  async countChaptersComplete(userId: string): Promise<number> {
    const rows = await db.$queryRaw<ChaptersCompleteRow[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS count
      FROM (
        SELECT v."chapterId", COUNT(*) AS viewed
        FROM verse_views vv
        JOIN verses v ON v.id = vv."verseId"
        WHERE vv."userId" = ${userId}
        GROUP BY v."chapterId"
      ) per_chapter
      JOIN chapters c ON c.id = per_chapter."chapterId"
      WHERE per_chapter.viewed >= c."verseCount"
    `);
    const first = rows[0];
    return first ? Number(first.count) : 0;
  },

  /**
   * Returns the user's active reading days within the last `lookbackDays`
   * (UTC date boundaries) in DESC order. Used by streak calculation.
   */
  recentReadingDays: async (userId: string, lookbackDays = 400): Promise<Date[]> => {
    const rows = await db.$queryRaw<DistinctDayRow[]>(Prisma.sql`
      SELECT "date" AS day
      FROM reading_days
      WHERE "userId" = ${userId}
        AND "date" >= (CURRENT_DATE - ${lookbackDays}::integer)
      ORDER BY "date" DESC
    `);
    return rows.map((r) => r.day);
  },

  updateStreaks: ({
    userId,
    streakDays,
    longestStreak,
  }: {
    userId: string;
    streakDays: number;
    longestStreak: number;
  }) =>
    db.user.update({
      where: { id: userId },
      data: { streakDays, longestStreak },
    }),

  getUserStreakState: (userId: string) =>
    db.user.findUnique({
      where: { id: userId },
      select: { streakDays: true, longestStreak: true, lastReadAt: true },
    }),

  mostRecentView: (userId: string) =>
    db.verseView.findFirst({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      select: {
        verse: {
          select: {
            number: true,
            sanskrit: true,
            chapter: { select: { number: true } },
            translations: {
              where: { isFeatured: true, language: { code: 'en' } },
              select: { text: true },
              take: 1,
            },
          },
        },
      },
    }),
};
