import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSession } from '@/features/auth';
import { countBookmarks, listBookmarks } from '@/features/bookmark';
import { Link } from '@/i18n/navigation';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ locale: string }>;

function firstName(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim().length > 0) {
    return name.split(' ')[0] ?? name;
  }
  if (email) return email.split('@')[0] ?? 'friend';
  return 'friend';
}

export default async function DashboardPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  // /me/layout already enforces auth, but TS doesn't know that.
  if (!session?.user) return null;

  const userId = session.user.id;

  const [t, bookmarkCount, recentBookmarks] = await Promise.all([
    getTranslations('me'),
    countBookmarks(userId),
    listBookmarks(userId),
  ]);

  const lastBookmark = recentBookmarks[0];
  const continueRef = lastBookmark
    ? {
        chapter: lastBookmark.verse.chapter.number,
        verse: lastBookmark.verse.number,
        sanskrit: lastBookmark.verse.sanskrit,
        translation: lastBookmark.verse.translations[0]?.text ?? '',
      }
    : null;

  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="lg">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-display text-3xl md:text-4xl text-text-primary">
              {t('greeting', { name: firstName(session.user.name, session.user.email) })}
            </h1>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-7 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/20 hover:border-gold-500/40 transition-colors">
              <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-2">
                {t('continueReading')}
              </p>
              {continueRef ? (
                <>
                  <p className="font-sanskrit text-text-sanskrit text-lg mb-2 line-clamp-2">
                    {continueRef.sanskrit.split('\n')[0]}
                  </p>
                  <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                    {continueRef.translation}
                  </p>
                  <Link
                    href={`/verse/${continueRef.chapter}/${continueRef.verse}`}
                    className="inline-flex items-center text-gold-500 text-sm hover:text-gold-300 transition-colors"
                  >
                    {t('continueReadingCta')}
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-text-secondary text-sm mb-4">{t('continueReadingEmpty')}</p>
                  <Link
                    href="/chapters"
                    className="inline-flex items-center text-gold-500 text-sm hover:text-gold-300 transition-colors"
                  >
                    {t('browseChapters')}
                  </Link>
                </>
              )}
            </div>

            <div className="col-span-12 md:col-span-5 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/10">
              <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-2">
                {t('todayMood')}
              </p>
              <p className="text-text-secondary text-sm mb-4">{t('todayMoodBody')}</p>
              <Link
                href="/daily"
                className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/20 transition-colors"
              >
                {t('chooseMood')}
              </Link>
            </div>

            <Link
              href="/me/bookmarks"
              className="col-span-12 md:col-span-4 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors group"
            >
              <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-3">
                {t('recentBookmarks')}
              </p>
              <p className="font-display text-3xl text-gold-300 mb-2">{bookmarkCount}</p>
              <p className="text-text-muted text-xs group-hover:text-gold-500 transition-colors">
                {t('viewAll')}
              </p>
            </Link>

            <Link
              href="/me/journal"
              className="col-span-12 md:col-span-4 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors group"
            >
              <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-3">
                {t('recentReflections')}
              </p>
              <p className="font-display text-3xl text-gold-300 mb-2">—</p>
              <p className="text-text-muted text-xs group-hover:text-gold-500 transition-colors">
                {t('viewAll')}
              </p>
            </Link>

            <Link
              href="/me/challenge"
              className="col-span-12 md:col-span-4 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors group"
            >
              <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-3">
                {t('challenge')}
              </p>
              <p className="font-display text-3xl text-gold-300 mb-2">—</p>
              <p className="text-text-muted text-xs group-hover:text-gold-500 transition-colors">
                {t('viewAll')}
              </p>
            </Link>
          </div>
        </Container>
      </main>
    </>
  );
}
