import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSession } from '@/features/auth';
import { type JournalListItem, listJournalEntries, moodOptions } from '@/features/journal';
import { Link } from '@/i18n/navigation';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ locale: string }>;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

type Group = 'today' | 'yesterday' | 'thisWeek' | 'earlier';

function bucketFor(entry: JournalListItem, now: number): Group {
  const ageMs = now - entry.createdAt.getTime();
  const ageDays = Math.floor(ageMs / MS_PER_DAY);
  if (ageDays <= 0) return 'today';
  if (ageDays === 1) return 'yesterday';
  if (ageDays < 7) return 'thisWeek';
  return 'earlier';
}

export default async function JournalListPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session?.user) return null;

  const [t, tMood, entries] = await Promise.all([
    getTranslations('journal'),
    getTranslations('moods'),
    listJournalEntries(session.user.id),
  ]);

  const now = Date.now();
  const buckets: Record<Group, JournalListItem[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    earlier: [],
  };
  for (const entry of entries) {
    buckets[bucketFor(entry, now)].push(entry);
  }

  const groupOrder: { key: Group; label: string }[] = [
    { key: 'today', label: t('groupToday') },
    { key: 'yesterday', label: t('groupYesterday') },
    { key: 'thisWeek', label: t('groupThisWeek') },
    { key: 'earlier', label: t('groupEarlier') },
  ];

  return (
    <>
      <Nav />
      <main className="py-12 md:py-16 relative">
        <Container size="md">
          <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-10">
            {t('heading')}
          </h1>

          {entries.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-xl text-text-secondary mb-2">{t('emptyTitle')}</p>
              <p className="text-text-muted mb-6">{t('emptyBody')}</p>
              <Link
                href="/chapters"
                className="text-gold-500 hover:text-gold-300 transition-colors"
              >
                {t('browseChapters')}
              </Link>
            </div>
          ) : (
            groupOrder.map(({ key, label }) =>
              buckets[key].length === 0 ? null : (
                <section key={key} className="mb-10">
                  <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">{label}</p>
                  <ul className="space-y-3">
                    {buckets[key].map((entry) => {
                      const preview = entry.content.slice(0, 220);
                      return (
                        <li key={entry.id}>
                          <Link
                            href={`/me/journal/${entry.id}`}
                            className="block p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-gold-500 text-xs font-mono">
                                {t('verseLabel', {
                                  ref: `${entry.verse.chapter.number}.${entry.verse.number}`,
                                })}
                              </span>
                              {entry.mood &&
                              (moodOptions as readonly string[]).includes(entry.mood) ? (
                                <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-300 text-xs">
                                  {tMood(entry.mood as (typeof moodOptions)[number])}
                                </span>
                              ) : null}
                            </div>
                            <p className="font-display text-text-primary text-base italic line-clamp-3">
                              {preview}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ),
            )
          )}
        </Container>

        <Link
          href="/chapters"
          aria-label={t('newEntry')}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gold-500 text-bg-base flex items-center justify-center text-xl hover:bg-gold-300 transition-colors shadow-lg glow-gold"
        >
          ✎
        </Link>
      </main>
    </>
  );
}
