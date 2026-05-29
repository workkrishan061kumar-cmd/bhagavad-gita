import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockVerses } from '@/shared/data/mock-verses';
import { situations } from '../page';

type Params = Promise<{ slug: string }>;

const intros: Record<string, { title: string; intro: string }> = {
  'fear-and-anxiety': {
    title: "When you're afraid",
    intro:
      'Fear is the mind grasping at outcomes. The Gita teaches that we are not what we fear losing — we are what abides through every loss.',
  },
  grief: {
    title: 'When you carry a loss',
    intro:
      'Grief honours what mattered. The Gita does not erase grief; it places it inside something larger that does not die.',
  },
  'career-and-purpose': {
    title: 'When you wonder why you work',
    intro:
      "Work performed with full effort but without grasping at its fruit is the Gita's answer to the modern crisis of purpose.",
  },
};

export default async function SituationDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const situation = situations.find((s) => s.slug === slug);
  if (!situation) return notFound();
  const meta = intros[slug] ?? {
    title: situation.label,
    intro: 'Verses curated for this situation:',
  };

  const reading = Object.values(mockVerses);

  return (
    <>
      <Nav />
      <main className="py-12 md:py-20">
        <Container size="sm">
          <Link
            href="/situations"
            className="text-sm text-text-muted hover:text-gold-500 transition-colors"
          >
            ← All situations
          </Link>

          <h1 className="font-display text-3xl md:text-4xl text-text-primary mt-8 mb-4">
            {meta.title}
          </h1>
          <p className="text-text-muted leading-relaxed mb-12">{meta.intro}</p>

          <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-5">A reading path</p>
          <div className="space-y-4">
            {reading.map((v) => (
              <Link
                key={`${v.chapter}.${v.verse}`}
                href={`/verse/${v.chapter}/${v.verse}`}
                className="block p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-gold-500 text-xs font-mono">
                    {v.chapter}.{v.verse}
                  </span>
                  <span className="text-text-muted/50 text-xs">— Read full verse</span>
                </div>
                <p className="font-sanskrit text-text-sanskrit text-base mb-2">
                  {v.sanskrit.split('\n')[0]}
                </p>
                <p className="text-text-secondary text-sm italic">
                  This verse speaks to {situation.label.toLowerCase()} by reminding us that…
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-14 p-6 rounded-xl bg-bg-elevated/40 border border-gold-500/20 text-center">
            <p className="text-text-secondary mb-3">Sit with one of these. Then write.</p>
            <Link
              href="/me/journal"
              className="inline-flex items-center px-5 py-2 rounded-full bg-gold-500 text-bg-base text-sm font-medium hover:bg-gold-300 transition-colors"
            >
              Open journal
            </Link>
          </div>
        </Container>
      </main>
    </>
  );
}
