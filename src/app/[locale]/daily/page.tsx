import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockVerses } from '@/shared/data/mock-verses';

const moods = [
  { key: 'anxious', label: 'Anxious', color: '#6B89B5', desc: 'When the mind races' },
  { key: 'grateful', label: 'Grateful', color: '#D4A24C', desc: 'A heart in thanks' },
  { key: 'confused', label: 'Confused', color: '#A88FB8', desc: 'Stuck between paths' },
  { key: 'motivated', label: 'Motivated', color: '#E89A4D', desc: 'Energy seeking direction' },
  { key: 'grieving', label: 'Grieving', color: '#7B7B8C', desc: 'Carrying a loss' },
  { key: 'angry', label: 'Angry', color: '#C4623E', desc: 'A storm inside' },
  { key: 'peaceful', label: 'Peaceful', color: '#8FB89E', desc: 'Quiet, settled' },
  { key: 'lost', label: 'Lost', color: '#9B8270', desc: 'Without a compass' },
] as const;

type SP = Promise<{ mood?: string }>;

export default async function DailyPage({ searchParams }: { searchParams: SP }) {
  const { mood } = await searchParams;
  const selected = moods.find((m) => m.key === mood);

  if (selected) {
    const verse = mockVerses['2.47'];
    if (!verse) return null;
    return (
      <>
        <Nav />
        <main className="py-12 md:py-20">
          <Container size="sm" className="text-center">
            <p
              className="uppercase tracking-[0.3em] text-xs mb-3"
              style={{ color: selected.color }}
            >
              For when you feel {selected.label.toLowerCase()}
            </p>
            <p className="text-gold-500 text-xs uppercase tracking-widest mb-12">
              Chapter {verse.chapter} · Verse {verse.verse}
            </p>

            <div
              className="p-8 md:p-12 rounded-2xl bg-bg-surface border space-y-6"
              style={{ borderColor: `${selected.color}33` }}
            >
              <p className="font-sanskrit text-text-sanskrit text-xl md:text-3xl leading-relaxed text-sanskrit-glow whitespace-pre-line">
                {verse.sanskrit}
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
              <p className="font-display text-text-primary text-lg leading-relaxed">
                {verse.english}
              </p>
            </div>

            <div className="mt-10">
              <p className="text-text-muted text-sm mb-4">What does this stir in you?</p>
              <textarea
                rows={3}
                placeholder="Write a reflection…"
                className="w-full bg-bg-surface/50 border border-gold-500/20 rounded-xl p-4 text-text-primary outline-none focus:border-gold-500/50 resize-none transition-colors"
              />
              <button
                type="button"
                className="mt-3 px-6 py-2.5 rounded-full bg-gold-500 text-bg-base font-medium text-sm hover:bg-gold-300 transition-colors"
              >
                Save reflection
              </button>
            </div>

            <Link
              href="/daily"
              className="mt-12 inline-block text-text-muted text-sm hover:text-gold-500 transition-colors"
            >
              ← Choose a different mood
            </Link>
          </Container>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="py-12 md:py-20">
        <Container size="md" className="text-center">
          <h1 className="font-display text-3xl md:text-5xl text-text-primary mb-4">
            How are you feeling today?
          </h1>
          <p className="text-text-muted mb-14">A verse, chosen for the weather in your mind.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {moods.map((m) => (
              <Link
                key={m.key}
                href={`/daily?mood=${m.key}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-all"
              >
                <div
                  className="w-20 h-20 rounded-full transition-transform group-hover:scale-105"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${m.color}, ${m.color}33 70%)`,
                    boxShadow: `0 0 32px -8px ${m.color}66`,
                  }}
                />
                <div>
                  <p className="text-text-primary font-medium">{m.label}</p>
                  <p className="text-text-muted text-xs mt-1">{m.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/verse/2/47"
            className="mt-14 inline-block text-text-muted text-sm hover:text-gold-500 transition-colors"
          >
            Just show me today's verse →
          </Link>
        </Container>
      </main>
    </>
  );
}
