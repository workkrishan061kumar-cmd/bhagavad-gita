import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSession } from '@/features/auth';
import { findLatestEntryForVerse } from '@/features/journal';
import { JournalEditor } from '@/features/journal/components/JournalEditor';
import { getVerse } from '@/features/verse';
import { Link, redirect } from '@/i18n/navigation';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ c?: string; v?: string }>;

function parseRef(value?: string): number | null {
  if (!value) return null;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

export default async function NewJournalEntryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ locale }, { c, v }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  const session = await getSession();
  if (!session?.user) return null;

  const chapter = parseRef(c);
  const verse = parseRef(v);

  const t = await getTranslations('journal');

  if (chapter === null || verse === null || chapter < 1 || chapter > 18 || verse < 1) {
    return (
      <>
        <Nav />
        <main className="py-12 md:py-16">
          <Container size="sm">
            <h1 className="font-display text-3xl text-text-primary mb-3">{t('newGenericTitle')}</h1>
            <p className="text-text-muted mb-6">{t('newGenericBody')}</p>
            <Link href="/chapters" className="text-gold-500 hover:text-gold-300 transition-colors">
              {t('browseChapters')}
            </Link>
          </Container>
        </main>
      </>
    );
  }

  // If there's already an entry for this verse, hop straight to it so the user
  // doesn't accidentally fragment their reflection into multiple entries.
  const existing = await findLatestEntryForVerse({
    userId: session.user.id,
    chapter,
    verse,
  });
  if (existing) {
    redirect({ href: `/me/journal/${existing.id}`, locale });
  }

  const verseData = await getVerse({ chapter, verse });
  if (!verseData) {
    return (
      <>
        <Nav />
        <main className="py-12 md:py-16">
          <Container size="sm">
            <h1 className="font-display text-3xl text-text-primary mb-3">{t('newGenericTitle')}</h1>
            <p className="text-text-muted">{t('newGenericBody')}</p>
          </Container>
        </main>
      </>
    );
  }

  const featuredTranslation = verseData.translations.find(
    (tn) => tn.isFeatured && tn.language.code === 'en',
  )?.text;

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

          <details className="mt-8 p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10" open>
            <summary className="cursor-pointer text-gold-500 text-sm font-mono">
              {t('reflectingOn', { ref: `${chapter}.${verse}` })}
            </summary>
            <div className="mt-4 space-y-3">
              <p className="font-sanskrit text-text-sanskrit text-base">
                {verseData.sanskrit.split('\n')[0]}
              </p>
              {featuredTranslation ? (
                <p className="text-text-secondary text-sm italic">{featuredTranslation}</p>
              ) : null}
            </div>
          </details>

          <JournalEditor
            mode="new"
            chapter={chapter}
            verse={verse}
            initialContent=""
            initialMood={null}
          />
        </Container>
      </main>
    </>
  );
}
