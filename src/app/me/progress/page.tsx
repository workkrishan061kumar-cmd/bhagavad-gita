import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockChapters } from '@/shared/data/mock-verses';

const completion = new Map<number, number>([
  [1, 1],
  [2, 0.62],
  [3, 0.18],
  [4, 0],
]);

export default function ProgressPage() {
  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="lg">
          <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-8">Your path</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Verses read', value: 84 },
              { label: 'Chapters complete', value: 1 },
              { label: 'Current streak', value: '7d' },
              { label: 'Longest streak', value: '21d' },
            ].map((s) => (
              <div
                key={s.label}
                className="p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10 text-center"
              >
                <p className="font-display text-3xl text-gold-300">{s.value}</p>
                <p className="text-text-muted text-xs mt-2 uppercase tracking-[0.15em]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-6">The eighteen</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-4">
            {mockChapters.map((ch) => {
              const pct = completion.get(ch.number) ?? 0;
              const opacity = 0.2 + pct * 0.8;
              return (
                <div key={ch.number} className="flex flex-col items-center">
                  <Mandala
                    seed={ch.number}
                    size={64}
                    className="transition-opacity"
                    stroke={`rgba(201,168,76,${opacity})`}
                  />
                  <p className="text-text-muted text-xs mt-2">Ch {ch.number}</p>
                  {pct > 0 && (
                    <p className="text-gold-500/60 text-[10px]">{Math.round(pct * 100)}%</p>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-text-muted/70 text-xs text-center mt-8">
            Brighter mandalas = more verses read in that chapter.
          </p>
        </Container>
      </main>
    </>
  );
}
