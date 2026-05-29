import { setRequestLocale } from 'next-intl/server';
import { searchVerses } from '@/features/verse';
import { Link } from '@/i18n/navigation';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

const suggestionChips = ['fear', 'duty', 'love', 'forgiveness', 'death', 'purpose'];

type Params = Promise<{ locale: string }>;
type SP = Promise<{ q?: string }>;

// Detect "2.47" / "12.5" style verse references and link directly.
function parseVerseRef(input: string): { chapter: number; verse: number } | null {
  const match = input.match(/^(\d{1,2})[.\-:/\s](\d{1,2})$/);
  if (!match || !match[1] || !match[2]) return null;
  const chapter = Number.parseInt(match[1], 10);
  const verse = Number.parseInt(match[2], 10);
  if (chapter < 1 || chapter > 18 || verse < 1 || verse > 78) return null;
  return { chapter, verse };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const ref = query ? parseVerseRef(query) : null;
  const results = query && !ref ? await searchVerses(query, 30) : [];

  return (
    <>
      <Nav />
      <main className="py-12 md:py-20">
        <Container size="md">
          <h1 className="font-display text-3xl md:text-4xl text-text-primary text-center mb-10">
            Search the Gita
          </h1>

          <form className="relative mb-6">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Try 'fear', 'duty', '2.47'…"
              autoComplete="off"
              className="w-full bg-bg-surface border border-gold-500/20 focus:border-gold-500 outline-none rounded-full pl-12 pr-5 py-3.5 text-text-primary placeholder:text-text-muted/60 transition-colors"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500/70">⌕</span>
          </form>

          {!query && (
            <>
              <p className="text-text-muted text-sm text-center mb-3">
                Try a feeling, a question, or a verse number
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestionChips.map((s) => (
                  <Link
                    key={s}
                    href={`/search?q=${s}`}
                    className="px-3.5 py-1.5 rounded-full border border-gold-500/30 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Verse reference like "2.47" — jump directly */}
          {ref && (
            <div className="text-center py-12">
              <p className="text-text-muted mb-4">
                Jumping to verse {ref.chapter}.{ref.verse}…
              </p>
              <Link
                href={`/verse/${ref.chapter}/${ref.verse}`}
                className="inline-flex items-center px-6 py-3 rounded-full bg-gold-500 text-bg-base text-sm font-medium hover:bg-gold-300 transition-colors"
              >
                Open verse {ref.chapter}.{ref.verse} →
              </Link>
            </div>
          )}

          {query && !ref && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted mb-4">No verses found for &ldquo;{query}&rdquo;.</p>
              <Link href="/ask" className="text-gold-500 hover:text-gold-300 transition-colors">
                Try Ask Krishna instead →
              </Link>
            </div>
          )}

          {query && !ref && results.length > 0 && (
            <div className="mt-8 space-y-4">
              <p className="text-text-muted text-sm">
                {results.length} {results.length === 1 ? 'verse' : 'verses'}
              </p>
              {results.map((v) => (
                <Link
                  key={`${v.chapterId}.${v.number}`}
                  href={`/verse/${v.chapterId}/${v.number}`}
                  className="block p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-gold-500 text-xs font-mono">
                      {v.chapterId}.{v.number}
                    </p>
                    <p className="text-text-muted/50 text-xs">
                      {v.authorName} · {v.languageCode.toUpperCase()}
                    </p>
                  </div>
                  <p className="font-sanskrit text-text-sanskrit text-sm mb-2 truncate">
                    {v.sanskrit.split('\n')[0]}
                  </p>
                  <p className="text-text-secondary text-sm line-clamp-2">{v.text}</p>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
