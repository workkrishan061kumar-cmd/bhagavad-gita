import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockChapters } from '@/shared/data/mock-verses';

type Params = Promise<{ n: string }>;

export default async function ChapterPage({ params }: { params: Params }) {
  const { n } = await params;
  const number = Number.parseInt(n, 10);
  const chapter = mockChapters.find((c) => c.number === number);
  if (!chapter) return notFound();

  return (
    <>
      <Nav />
      <main className="py-12 md:py-20">
        <Container size="md">
          <Link
            href="/chapters"
            className="text-sm text-text-muted hover:text-gold-500 transition-colors"
          >
            ← All chapters
          </Link>

          {/* Hero */}
          <div className="mt-10 grid md:grid-cols-[auto_1fr] gap-8 items-center">
            <Mandala seed={chapter.number} size={200} className="text-gold-500/40" />
            <div>
              <p className="text-gold-500 uppercase tracking-[0.25em] text-xs mb-3">
                Chapter {chapter.number}
              </p>
              <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-2">
                {chapter.titleEn}
              </h1>
              <p className="font-sanskrit text-text-sanskrit text-xl mb-4">{chapter.titleSa}</p>
              <p className="text-text-muted leading-relaxed">{chapter.summary}</p>
              <p className="text-text-muted text-xs mt-4">{chapter.verseCount} verses</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/verse/${chapter.number}/1`}
              className="px-6 py-2.5 rounded-full bg-gold-500 text-bg-base text-sm font-medium hover:bg-gold-300 transition-colors"
            >
              Start reading from verse 1
            </Link>
            <button
              type="button"
              className="px-6 py-2.5 rounded-full border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
            >
              Pick a verse ▾
            </button>
          </div>

          {/* Placeholder verse list */}
          <div className="mt-16">
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">Verses</p>
            <ul className="divide-y divide-gold-500/10 border-y border-gold-500/10">
              {Array.from({ length: Math.min(chapter.verseCount, 8) }).map((_, idx) => {
                const v = idx + 1;
                return (
                  <li key={v}>
                    <Link
                      href={`/verse/${chapter.number}/${v}`}
                      className="flex items-center gap-4 py-4 hover:bg-bg-surface/40 transition-colors group"
                    >
                      <span className="text-gold-500 text-xs font-mono w-10">
                        {chapter.number}.{v}
                      </span>
                      <span className="text-text-muted text-sm flex-1 truncate">
                        {v === 47 && chapter.number === 2
                          ? 'You have a right to perform your prescribed duty…'
                          : `Verse ${v} preview text will appear here once seeded…`}
                      </span>
                      <span className="text-text-muted/40 group-hover:text-gold-500 text-sm">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="text-text-muted/60 text-xs text-center mt-4">
              {chapter.verseCount - 8} more verses load once database is seeded
            </p>
          </div>
        </Container>
      </main>
    </>
  );
}
