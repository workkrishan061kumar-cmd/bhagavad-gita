import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockVerses } from '@/shared/data/mock-verses';

export default function DashboardPage() {
  const sample = mockVerses['2.47'];
  if (!sample) return null;

  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="lg">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-display text-3xl md:text-4xl text-text-primary">
              Namaste, Krishan
            </h1>
            <div className="flex items-center gap-2 text-gold-500">
              <span className="text-2xl">🪔</span>
              <span className="text-sm">7-day streak</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-7 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/20 hover:border-gold-500/40 transition-colors">
              <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-2">
                Continue reading
              </p>
              <p className="font-sanskrit text-text-sanskrit text-lg mb-2">
                {sample.sanskrit.split('\n')[0]}
              </p>
              <p className="text-text-secondary text-sm line-clamp-2 mb-4">{sample.english}</p>
              <Link
                href={`/verse/${sample.chapter}/${sample.verse}`}
                className="inline-flex items-center text-gold-500 text-sm hover:text-gold-300 transition-colors"
              >
                Pick up where you left off →
              </Link>
            </div>

            <div className="col-span-12 md:col-span-5 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/10">
              <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-2">
                Today&apos;s mood
              </p>
              <p className="text-text-secondary text-sm mb-4">
                Pick a feeling. We&apos;ll find a verse for it.
              </p>
              <Link
                href="/daily"
                className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/20 transition-colors"
              >
                Choose mood →
              </Link>
            </div>

            {[
              { label: 'Recent bookmarks', href: '/me/bookmarks', count: 12 },
              { label: 'Recent reflections', href: '/me/journal', count: 5 },
              { label: '18-Day Challenge', href: '/me/challenge', count: '7 / 18' },
            ].map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="col-span-12 md:col-span-4 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors group"
              >
                <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-3">
                  {card.label}
                </p>
                <p className="font-display text-3xl text-gold-300 mb-2">{card.count}</p>
                <p className="text-text-muted text-xs group-hover:text-gold-500 transition-colors">
                  View all →
                </p>
              </Link>
            ))}

            <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-5 mt-2">
              {[
                { label: 'Verses read', value: 84 },
                { label: 'Chapters complete', value: 3 },
                { label: 'Longest streak', value: 21 },
                { label: 'Days journaling', value: 18 },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-5 rounded-xl bg-bg-elevated/30 border border-gold-500/10 text-center"
                >
                  <p className="font-display text-2xl text-gold-300">{s.value}</p>
                  <p className="text-text-muted text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
