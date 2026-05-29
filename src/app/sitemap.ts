import type { MetadataRoute } from 'next';
import { getAllChapters } from '@/features/chapter';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bhagwad-geeta-phi.vercel.app';

const LOCALES = ['en', 'hi'] as const;

// Generate paths for both English (no prefix) and Hindi (/hi prefix).
function localePath(locale: (typeof LOCALES)[number], path: string): string {
  if (locale === 'en') return `${BASE_URL}${path}`;
  return `${BASE_URL}/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const chapters = await getAllChapters();

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Top-level routes (high priority).
  const topRoutes = [
    { path: '/', priority: 1.0 },
    { path: '/chapters', priority: 0.9 },
    { path: '/ask', priority: 0.85 },
    { path: '/daily', priority: 0.8 },
    { path: '/library', priority: 0.7 },
    { path: '/about', priority: 0.6 },
    { path: '/faqs', priority: 0.5 },
    { path: '/donate', priority: 0.4 },
  ];

  for (const locale of LOCALES) {
    for (const { path, priority } of topRoutes) {
      entries.push({
        url: localePath(locale, path),
        lastModified: now,
        priority,
        alternates: {
          languages: Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)])),
        },
      });
    }
  }

  // Chapter pages.
  for (const locale of LOCALES) {
    for (const chapter of chapters) {
      entries.push({
        url: localePath(locale, `/chapter/${chapter.number}`),
        lastModified: now,
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, localePath(l, `/chapter/${chapter.number}`)]),
          ),
        },
      });

      // Per-verse pages (this is the bulk — ~700 verses × 2 locales = 1,400 URLs).
      for (let v = 1; v <= chapter.verseCount; v++) {
        entries.push({
          url: localePath(locale, `/verse/${chapter.number}/${v}`),
          lastModified: now,
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(
              LOCALES.map((l) => [l, localePath(l, `/verse/${chapter.number}/${v}`)]),
            ),
          },
        });
      }
    }
  }

  return entries;
}
