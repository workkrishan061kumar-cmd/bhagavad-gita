import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockVerses } from '@/shared/data/mock-verses';

type Params = Promise<{ c: string; v: string }>;

export default async function VersePage({ params }: { params: Params }) {
  const { c, v } = await params;
  const verse = mockVerses[`${c}.${v}`];
  if (!verse) return notFound();

  const seed = Number.parseInt(c, 10) * 1000 + Number.parseInt(v, 10);

  return (
    <>
      <Nav />

      <main className="relative py-12 md:py-20">
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none pt-20">
          <Mandala seed={seed} size={620} className="text-gold-500/[0.05]" />
        </div>

        <Container size="sm" className="relative z-10">
          {/* Breadcrumb / position */}
          <div className="flex items-center justify-between mb-10 text-sm">
            <Link
              href={`/chapter/${verse.chapter}`}
              className="text-text-muted hover:text-gold-500 transition-colors"
            >
              ← Chapter {verse.chapter}
            </Link>
            <div className="text-gold-500/70 font-mono">{verse.verse} / 72</div>
          </div>

          {/* Verse marker */}
          <p className="text-center text-gold-500 text-xs uppercase tracking-[0.3em] mb-10">
            · Chapter {verse.chapter} · Verse {verse.verse} ·
          </p>

          {/* Sanskrit */}
          <p className="font-sanskrit text-text-sanskrit text-2xl md:text-4xl text-center leading-relaxed text-sanskrit-glow whitespace-pre-line">
            {verse.sanskrit}
          </p>

          {/* Divider */}
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

          {/* Transliteration */}
          <p className="text-text-muted italic text-center text-sm md:text-base">
            {verse.transliteration}
          </p>

          {/* Translation */}
          <p className="font-display text-text-primary text-lg md:text-xl leading-relaxed text-center mt-8">
            {verse.english}
          </p>

          {/* Tabs */}
          <div className="mt-14 border-b border-gold-500/20 flex gap-6 justify-center text-sm">
            {['Translation', 'Word-by-word', 'Commentary', 'Reflect'].map((tab, i) => (
              <button
                key={tab}
                type="button"
                className={
                  i === 0
                    ? 'pb-3 text-gold-500 border-b-2 border-gold-500'
                    : 'pb-3 text-text-muted hover:text-text-primary transition-colors'
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-8 text-text-secondary leading-relaxed">
            <p>{verse.english}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {verse.themes.map((theme) => (
                <Link
                  key={theme}
                  href={`/themes/${theme}`}
                  className="px-3 py-1 text-xs rounded-full border border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
                >
                  {theme}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
            >
              ♡ Bookmark
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
            >
              ↗ Share
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
            >
              ✎ Journal
            </button>
          </div>

          {/* Footer nav */}
          <div className="mt-16 flex items-center justify-between text-sm">
            <Link
              href={`/verse/${verse.chapter}/${verse.verse - 1}`}
              className="px-4 py-2 rounded-full text-text-muted hover:text-gold-500 transition-colors"
            >
              ← Verse {verse.verse - 1}
            </Link>
            <Link
              href={`/verse/${verse.chapter}/${verse.verse + 1}`}
              className="px-4 py-2 rounded-full text-text-muted hover:text-gold-500 transition-colors"
            >
              Verse {verse.verse + 1} →
            </Link>
          </div>

          {/* Anon CTA */}
          <p className="mt-16 text-center text-xs text-text-muted/60">
            Sign in to bookmark and reflect on this verse.
          </p>
        </Container>
      </main>
    </>
  );
}
