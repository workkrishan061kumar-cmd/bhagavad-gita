import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSession } from '@/features/auth';
import { getJournalEntry } from '@/features/journal';
import { JournalEditor } from '@/features/journal/components/JournalEditor';
import { Link } from '@/i18n/navigation';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ locale: string; id: string }>;

export default async function JournalEntryPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) return notFound();

  const session = await getSession();
  if (!session?.user) return null;

  const [t, entry] = await Promise.all([
    getTranslations('journal'),
    getJournalEntry({ userId: session.user.id, id: numericId }),
  ]);
  if (!entry) return notFound();

  const chapter = entry.verse.chapter.number;
  const verse = entry.verse.number;
  const featuredTranslation = entry.verse.translations[0]?.text;
  const createdAt = entry.createdAt.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="sm">
          <Link
            href="/me/journal"
            className="text-sm text-text-muted hover:text-gold-500 transition-colors"
          >
            {t('backToAll')}
          </Link>

          {/* Verse this entry reflects on */}
          <details className="mt-8 p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10" open>
            <summary className="cursor-pointer text-gold-500 text-sm font-mono">
              {t('reflectingOn', { ref: `${chapter}.${verse}` })}
            </summary>
            <div className="mt-4 space-y-3">
              <p className="font-sanskrit text-text-sanskrit text-base">
                {entry.verse.sanskrit.split('\n')[0]}
              </p>
              {featuredTranslation ? (
                <p className="text-text-secondary text-sm italic">{featuredTranslation}</p>
              ) : null}
              <Link
                href={`/verse/${chapter}/${verse}`}
                className="inline-block text-gold-500 hover:text-gold-300 text-xs transition-colors"
              >
                {`${entry.verse.chapter.titleEn} →`}
              </Link>
            </div>
          </details>

          {/* Header line */}
          <div className="flex items-center gap-3 mt-8 mb-2 text-xs text-text-muted">
            <span>{t('entryNumber', { id: entry.id })}</span>
            <span aria-hidden="true">·</span>
            <span>{t('createdAt', { date: createdAt })}</span>
          </div>

          {/* Editor */}
          <JournalEditor
            mode="existing"
            entryId={entry.id}
            chapter={chapter}
            verse={verse}
            initialContent={entry.content}
            initialMood={entry.mood}
          />
        </Container>
      </main>
    </>
  );
}
