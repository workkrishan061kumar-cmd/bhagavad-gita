import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNeighborVerses, getVerse, VerseAudioPlayer } from '@/features/verse';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ c: string; v: string }>;

export default async function VersePage({ params }: { params: Params }) {
  const { c, v } = await params;
  const chapter = Number.parseInt(c, 10);
  const verse = Number.parseInt(v, 10);
  if (Number.isNaN(chapter) || Number.isNaN(verse)) return notFound();

  const [data, neighbors] = await Promise.all([
    getVerse({ chapter, verse }),
    getNeighborVerses({ chapter, verse }),
  ]);
  if (!data) return notFound();

  const featuredEn = data.translations.find((t) => t.language.code === 'en' && t.isFeatured);
  const featuredHi = data.translations.find((t) => t.language.code === 'hi' && t.isFeatured);
  const featuredRecitation = data.recitations[0];

  const seed = chapter * 1000 + verse;

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
              href={`/chapter/${chapter}`}
              className="text-text-muted hover:text-gold-500 transition-colors"
            >
              ← Chapter {chapter}
            </Link>
            <div className="text-gold-500/70 font-mono">
              {verse} / {data.chapter.verseCount}
            </div>
          </div>

          {/* Verse marker */}
          <p className="text-center text-gold-500 text-xs uppercase tracking-[0.3em] mb-8">
            · Chapter {chapter} · Verse {verse} ·
          </p>

          {/* Audio recitation */}
          {featuredRecitation && (
            <div className="mb-10">
              <VerseAudioPlayer
                audioUrl={featuredRecitation.audioUrl}
                reciter={featuredRecitation.reciter.name}
                seed={seed}
              />
            </div>
          )}

          {/* Sanskrit */}
          <p className="font-sanskrit text-text-sanskrit text-2xl md:text-4xl text-center leading-relaxed text-sanskrit-glow whitespace-pre-line">
            {data.sanskrit}
          </p>

          {/* Divider */}
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

          {/* Transliteration */}
          <p className="text-text-muted italic text-center text-sm md:text-base whitespace-pre-line">
            {data.transliteration}
          </p>

          {/* English featured translation */}
          {featuredEn && (
            <div className="mt-10">
              <p className="text-gold-500/60 text-xs uppercase tracking-[0.2em] text-center mb-3">
                {featuredEn.author.name} — English
              </p>
              <p className="font-display text-text-primary text-lg md:text-xl leading-relaxed text-center">
                {featuredEn.text}
              </p>
            </div>
          )}

          {/* Hindi featured translation */}
          {featuredHi && (
            <div className="mt-8">
              <p className="text-gold-500/60 text-xs uppercase tracking-[0.2em] text-center mb-3">
                {featuredHi.author.name} — हिन्दी
              </p>
              <p className="font-display text-text-primary text-base md:text-lg leading-relaxed text-center">
                {featuredHi.text}
              </p>
            </div>
          )}

          {/* Word meanings */}
          {data.wordMeanings && (
            <details className="mt-10 group">
              <summary className="cursor-pointer text-gold-500 text-xs uppercase tracking-[0.2em] text-center hover:text-gold-300 transition-colors">
                Word-by-word →
              </summary>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed">
                {data.wordMeanings}
              </p>
            </details>
          )}

          {/* All translations */}
          {data.translations.length > 1 && (
            <details className="mt-6 group">
              <summary className="cursor-pointer text-gold-500 text-xs uppercase tracking-[0.2em] text-center hover:text-gold-300 transition-colors">
                {data.translations.length} translations available →
              </summary>
              <div className="mt-6 space-y-5">
                {data.translations.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-bg-surface/40 border border-gold-500/10"
                  >
                    <p className="text-gold-500/70 text-xs mb-1">
                      {t.author.name} · {t.language.nativeName}
                      {t.isFeatured && ' · featured'}
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">{t.text}</p>
                  </div>
                ))}
              </div>
            </details>
          )}

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
            {neighbors.prev ? (
              <Link
                href={`/verse/${chapter}/${neighbors.prev}`}
                className="px-4 py-2 rounded-full text-text-muted hover:text-gold-500 transition-colors"
              >
                ← Verse {neighbors.prev}
              </Link>
            ) : (
              <span />
            )}
            {neighbors.next ? (
              <Link
                href={`/verse/${chapter}/${neighbors.next}`}
                className="px-4 py-2 rounded-full text-text-muted hover:text-gold-500 transition-colors"
              >
                Verse {neighbors.next} →
              </Link>
            ) : (
              <Link
                href={`/chapter/${chapter + 1}`}
                className="px-4 py-2 rounded-full text-text-muted hover:text-gold-500 transition-colors"
              >
                Next chapter →
              </Link>
            )}
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
