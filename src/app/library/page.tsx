import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

export const mockBooks = [
  {
    slug: 'easwaran-translation',
    title: 'The Bhagavad Gita',
    author: 'Eknath Easwaran',
    language: 'English',
    description: 'A modern, accessible translation that pairs each verse with introductory essays.',
    pages: 304,
    sizeMb: 1.6,
  },
  {
    slug: 'gita-press-hindi',
    title: 'श्रीमद्भगवद्गीता',
    author: 'Gita Press, Gorakhpur',
    language: 'Hindi',
    description: 'The canonical Hindi rendering with line-by-line Sanskrit and devanagari layout.',
    pages: 412,
    sizeMb: 3.1,
  },
  {
    slug: 'prabhupada-as-it-is',
    title: 'Bhagavad-gītā As It Is',
    author: 'A. C. Bhaktivedanta Swami Prabhupāda',
    language: 'English',
    description:
      'The most-cited English edition with extensive purports and Sanskrit transliteration.',
    pages: 1024,
    sizeMb: 9.4,
  },
];

export default function LibraryPage() {
  return (
    <>
      <Nav />
      <main className="py-12 md:py-20">
        <Container size="lg">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-3">Library</h1>
            <p className="text-text-muted">Public-domain translations. Free forever.</p>
          </div>

          <div className="flex gap-2 mb-10 justify-center text-sm">
            {['All', 'English', 'Hindi', 'Sanskrit'].map((f, i) => (
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockBooks.map((b) => (
              <Link
                key={b.slug}
                href={`/library/${b.slug}`}
                className="group rounded-2xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-all overflow-hidden"
              >
                <div
                  className="aspect-[3/4] flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(11,15,26,0.85) 100%)',
                  }}
                >
                  <p className="font-display text-gold-300 text-center px-6">{b.title}</p>
                </div>
                <div className="p-5">
                  <p className="font-display text-text-primary text-base mb-1">{b.title}</p>
                  <p className="text-text-muted text-sm mb-3">{b.author}</p>
                  <p className="text-text-secondary text-xs leading-relaxed mb-4">
                    {b.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-500 text-xs">
                      {b.language}
                    </span>
                    <span className="text-text-muted/60 text-xs">
                      {b.pages}p · {b.sizeMb}MB
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-center text-text-muted/70 text-sm mt-14">
            All books are in the public domain.{' '}
            <Link href="/donate" className="text-gold-500 hover:text-gold-300">
              Consider donating →
            </Link>
          </p>
        </Container>
      </main>
    </>
  );
}
