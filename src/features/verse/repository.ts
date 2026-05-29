import { Prisma } from '@prisma/client';
import { db } from '@/shared/lib/db';

export type VerseRef = { chapter: number; verse: number };

export type SearchResult = {
  chapterId: number;
  number: number;
  sanskrit: string;
  text: string;
  authorName: string;
  languageCode: string;
  rank: number;
};

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

  /**
   * Postgres full-text search over verse translations.
   * Ranks by ts_rank against the `search_tsv` column.
   * Returns the highest-ranked featured translation per verse.
   */
  search: async (query: string, limit = 20): Promise<SearchResult[]> => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    // websearch_to_tsquery handles natural-language queries (quotes, OR, -, etc.)
    // 'simple' config works for both English and Hindi without language-specific stemming.
    const rows = await db.$queryRaw<SearchResult[]>(Prisma.sql`
      SELECT DISTINCT ON (v.id)
        v."chapterId"      AS "chapterId",
        v.number           AS number,
        v.sanskrit         AS sanskrit,
        vt.text            AS text,
        a.name             AS "authorName",
        l.code             AS "languageCode",
        ts_rank(vt.search_tsv, websearch_to_tsquery('simple', ${trimmed})) AS rank
      FROM verse_translations vt
      JOIN verses    v ON v.id = vt."verseId"
      JOIN authors   a ON a.id = vt."authorId"
      JOIN languages l ON l.id = vt."languageId"
      WHERE vt.search_tsv @@ websearch_to_tsquery('simple', ${trimmed})
      ORDER BY v.id, ts_rank(vt.search_tsv, websearch_to_tsquery('simple', ${trimmed})) DESC, vt."isFeatured" DESC
      LIMIT ${limit}
    `);

    // Re-sort by rank since DISTINCT ON forces ordering by v.id first.
    return rows.sort((a, b) => b.rank - a.rank);
  },
};

export type VerseWithTranslations = NonNullable<
  Awaited<ReturnType<typeof verseRepository.findByRef>>
>;

export type ChapterVersePreview = Awaited<
  ReturnType<typeof verseRepository.findManyByChapter>
>[number];
