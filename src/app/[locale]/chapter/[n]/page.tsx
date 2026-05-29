import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getChapter } from '@/features/chapter';
import { getVersesInChapter } from '@/features/verse';
import { Link } from '@/i18n/navigation';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ locale: string; n: string }>;

export default async function ChapterPage({ params }: { params: Params }) {
  const { locale, n } = await params;
  setRequestLocale(locale);

  const number = Number.parseInt(n, 10);
  if (Number.isNaN(number) || number < 1 || number > 18) return notFound();

  const [chapter, verses, t] = await Promise.all([
    getChapter(number),
    getVersesInChapter(number),
    getTranslations('chapter'),
  ]);
  if (!chapter) return notFound();

  // Use Hindi summary if user is on Hindi locale and we have one
  const summary = locale === 'hi' && chapter.summaryHi ? chapter.summaryHi : chapter.summary;

  return (
    <>
      <Nav />
      <main className="py-12 md:py-20">
        <Container size="md">
          <Link
            href="/chapters"
            className="text-sm text-text-muted hover:text-gold-500 transition-colors"
          >
            {t('backToAll')}
          </Link>

          {/* Hero */}
          <div className="mt-10 grid md:grid-cols-[auto_1fr] gap-8 items-center">
            <Mandala seed={chapter.number} size={200} className="text-gold-500/40" />
            <div>
              <p className="text-gold-500 uppercase tracking-[0.25em] text-xs mb-3">
                {t('chapterLabel', { n: chapter.number })}
              </p>
              <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-2">
                {chapter.titleEn}
              </h1>
              <p className="font-sanskrit text-text-sanskrit text-xl mb-4">{chapter.titleSa}</p>
              <p className="text-text-muted leading-relaxed line-clamp-6">{summary}</p>
              <p className="text-text-muted text-xs mt-4">
                {t('verseCount', { count: chapter.verseCount })}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/verse/${chapter.number}/1`}
              className="px-6 py-2.5 rounded-full bg-gold-500 text-bg-base text-sm font-medium hover:bg-gold-300 transition-colors"
            >
              {t('startReading')}
            </Link>
          </div>

          {/* Verse list */}
          <div className="mt-16">
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">
              {t('versesHeading')}
            </p>
            <ul className="divide-y divide-gold-500/10 border-y border-gold-500/10">
              {verses.map((v) => {
                const featured = v.translations[0];
                return (
                  <li key={v.id}>
                    <Link
                      href={`/verse/${chapter.number}/${v.number}`}
                      className="flex items-center gap-4 py-4 hover:bg-bg-surface/40 transition-colors group"
                    >
                      <span className="text-gold-500 text-xs font-mono w-10">
                        {chapter.number}.{v.number}
                      </span>
                      <span className="text-text-muted text-sm flex-1 truncate">
                        {featured?.text ?? v.sanskrit.split('\n')[0]}
                      </span>
                      <span className="text-text-muted/40 group-hover:text-gold-500 text-sm">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </main>
    </>
  );
}
