import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSession } from '@/features/auth';
import { listBookmarks } from '@/features/bookmark';
import { RemoveBookmarkButton } from '@/features/bookmark/components/RemoveBookmarkButton';
import { Link } from '@/i18n/navigation';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ locale: string }>;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

type BookmarksT = Awaited<ReturnType<typeof getTranslations>>;

function savedAgo(t: BookmarksT, createdAt: Date) {
  const diff = Math.floor((Date.now() - createdAt.getTime()) / MS_PER_DAY);
  if (diff <= 0) return t('savedAgo', { ago: t('ago_today') });
  if (diff === 1) return t('savedAgo', { ago: t('ago_yesterday') });
  if (diff < 7) return t('savedAgo', { ago: t('ago_days', { count: diff }) });
  const weeks = Math.floor(diff / 7);
  return t('savedAgo', { ago: t('ago_weeks', { count: weeks }) });
}

export default async function BookmarksPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session?.user) return null;

  const [t, bookmarks] = await Promise.all([
    getTranslations('bookmarks'),
    listBookmarks(session.user.id),
  ]);
  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="md">
          <div className="flex items-end justify-between mb-8">
            <h1 className="font-display text-3xl md:text-4xl text-text-primary">{t('heading')}</h1>
            <p className="text-text-muted text-sm">
              {t('countLabel', { count: bookmarks.length })}
            </p>
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-xl text-text-secondary mb-2">{t('emptyTitle')}</p>
              <p className="text-text-muted mb-6">{t('emptyBody')}</p>
              <Link
                href="/chapters"
                className="text-gold-500 hover:text-gold-300 transition-colors"
              >
                {t('browse')}
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookmarks.map((b) => {
                const chapterNumber = b.verse.chapter.number;
                const verseNumber = b.verse.number;
                const featured = b.verse.translations[0]?.text;
                return (
                  <li
                    key={b.id}
                    className="flex items-start gap-4 p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors"
                  >
                    <Link
                      href={`/verse/${chapterNumber}/${verseNumber}`}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-gold-500 text-xs font-mono mb-1">
                        {chapterNumber}.{verseNumber}
                      </p>
                      <p className="font-sanskrit text-text-sanskrit text-base mb-1 truncate">
                        {b.verse.sanskrit.split('\n')[0]}
                      </p>
                      {featured ? (
                        <p className="text-text-secondary text-sm line-clamp-2">{featured}</p>
                      ) : null}
                      <p className="text-text-muted/60 text-xs mt-2">{savedAgo(t, b.createdAt)}</p>
                    </Link>
                    <RemoveBookmarkButton chapter={chapterNumber} verse={verseNumber} />
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </main>
    </>
  );
}
