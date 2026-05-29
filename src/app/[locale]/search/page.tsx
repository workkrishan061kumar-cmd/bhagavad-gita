import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockVerses } from '@/shared/data/mock-verses';

const suggestionChips = ['fear', 'duty', 'love', 'forgiveness', 'death', 'purpose'];

type SP = Promise<{ q?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const results = query ? Object.values(mockVerses) : [];

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

          {query && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted mb-4">No verses found for &ldquo;{query}&rdquo;.</p>
              <Link href="/ask" className="text-gold-500 hover:text-gold-300 transition-colors">
                Try Ask Krishna instead →
              </Link>
            </div>
          )}

          {query && results.length > 0 && (
            <div className="mt-8 space-y-4">
              <p className="text-text-muted text-sm">{results.length} verses</p>
              {results.map((v) => (
                <Link
                  key={`${v.chapter}.${v.verse}`}
                  href={`/verse/${v.chapter}/${v.verse}`}
                  className="block p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors"
                >
                  <p className="text-gold-500 text-xs font-mono mb-2">
                    {v.chapter}.{v.verse}
                  </p>
                  <p className="font-sanskrit text-text-sanskrit text-base mb-2 truncate">
                    {v.sanskrit.split('\n')[0]}
                  </p>
                  <p className="text-text-secondary text-sm line-clamp-2">{v.english}</p>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
