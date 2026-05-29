import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

export const situations = [
  { slug: 'career-and-purpose', label: 'Career & purpose', icon: '✦' },
  { slug: 'relationships', label: 'Relationships', icon: '◇' },
  { slug: 'grief', label: 'Grief', icon: '○' },
  { slug: 'fear-and-anxiety', label: 'Fear & anxiety', icon: '⌇' },
  { slug: 'anger', label: 'Anger', icon: '△' },
  { slug: 'forgiveness', label: 'Forgiveness', icon: '✿' },
  { slug: 'failure', label: 'Failure', icon: '↓' },
  { slug: 'death', label: 'Death', icon: '◐' },
  { slug: 'doubt', label: 'Doubt', icon: '?' },
  { slug: 'loneliness', label: 'Loneliness', icon: '·' },
  { slug: 'decision-making', label: 'Decisions', icon: '⇋' },
  { slug: 'self-worth', label: 'Self-worth', icon: '◆' },
];

export default function SituationsPage() {
  return (
    <>
      <Nav />
      <main className="py-12 md:py-20">
        <Container size="lg">
          <div className="text-center mb-12">
            <p className="text-gold-500 uppercase tracking-[0.3em] text-xs mb-3">Guidance map</p>
            <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-3">
              Find guidance for your situation
            </h1>
            <p className="text-text-muted">
              Pick what&apos;s on your mind. A curated reading path will open.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {situations.map((s) => (
              <Link
                key={s.slug}
                href={`/situations/${s.slug}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 hover:bg-bg-surface transition-all"
              >
                <span className="text-3xl text-gold-500/70 group-hover:text-gold-500 transition-colors">
                  {s.icon}
                </span>
                <p className="text-text-secondary group-hover:text-text-primary text-center text-sm transition-colors">
                  {s.label}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
