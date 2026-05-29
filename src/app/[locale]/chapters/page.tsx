import Link from 'next/link';
import { getAllChapters } from '@/features/chapter';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

const romans = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
];

export default async function ChaptersPage() {
  const chapters = await getAllChapters();

  return (
    <>
      <Nav />
      <main className="py-12 md:py-20">
        <Container size="lg">
          <div className="text-center mb-14">
            <p className="text-gold-500 uppercase tracking-[0.3em] text-xs mb-3">
              Eighteen chapters
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-3">
              The Eighteen Chapters
            </h1>
            <p className="text-text-muted">
              {chapters.reduce((n, ch) => n + ch.verseCount, 0)} verses, one timeless conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {chapters.map((ch, i) => (
              <Link
                key={ch.number}
                href={`/chapter/${ch.number}`}
                className="group p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 hover:bg-bg-surface transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Mandala
                      seed={ch.number}
                      size={80}
                      className="text-gold-500/40 group-hover:text-gold-500/70 transition-colors"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gold-500 text-xs font-mono mb-1">{romans[i]}</p>
                    <p className="font-sanskrit text-text-sanskrit text-base mb-1 truncate">
                      {ch.titleSa}
                    </p>
                    <p className="font-display text-text-primary text-sm">{ch.titleEn}</p>
                    <p className="text-text-muted text-xs mt-2">{ch.verseCount} verses</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
