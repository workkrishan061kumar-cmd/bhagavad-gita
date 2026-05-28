import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockVerses } from '@/shared/data/mock-verses';

export default function BookmarksPage() {
  const bookmarks = Object.values(mockVerses);

  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="md">
          <div className="flex items-end justify-between mb-8">
            <h1 className="font-display text-3xl md:text-4xl text-text-primary">Saved verses</h1>
            <p className="text-text-muted text-sm">{bookmarks.length} verses</p>
          </div>

          <div className="flex gap-2 mb-6 text-sm">
            {['All', 'By chapter', 'By theme', 'Recent'].map((f, i) => (
              <button
                key={f}
                type="button"
                className={
                  i === 0
                    ? 'px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-500'
                    : 'px-4 py-1.5 rounded-full border border-gold-500/15 text-text-muted hover:border-gold-500/40 hover:text-gold-500 transition-colors'
                }
              >
                {f}
              </button>
            ))}
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted mb-4">
                No bookmarks yet. Tap any verse&apos;s heart to save it for later.
              </p>
              <Link
                href="/chapters"
                className="text-gold-500 hover:text-gold-300 transition-colors"
              >
                Browse chapters →
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookmarks.map((v) => (
                <li
                  key={`${v.chapter}.${v.verse}`}
                  className="flex items-start gap-4 p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors"
                >
                  <Link href={`/verse/${v.chapter}/${v.verse}`} className="flex-1 min-w-0">
                    <p className="text-gold-500 text-xs font-mono mb-1">
                      {v.chapter}.{v.verse}
                    </p>
                    <p className="font-sanskrit text-text-sanskrit text-base mb-1 truncate">
                      {v.sanskrit.split('\n')[0]}
                    </p>
                    <p className="text-text-secondary text-sm line-clamp-2">{v.english}</p>
                    <p className="text-text-muted/60 text-xs mt-2">Saved 2 days ago</p>
                  </Link>
                  <button
                    type="button"
                    className="shrink-0 text-gold-500 hover:text-gold-300 transition-colors"
                    aria-label="Remove bookmark"
                  >
                    ♥
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </main>
    </>
  );
}
