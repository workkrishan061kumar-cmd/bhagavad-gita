import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

const mockEntries = [
  {
    id: 1,
    date: 'Today',
    verseRef: '2.47',
    preview:
      "Reading this again, I noticed something — the verse isn't about giving up on outcomes, it's about not letting them own you…",
    mood: 'reflective',
  },
  {
    id: 2,
    date: 'Yesterday',
    verseRef: '18.66',
    preview: 'Surrender feels like the hardest practice. I keep wanting to control the outcome.',
    mood: 'anxious',
  },
  {
    id: 3,
    date: 'Tuesday',
    verseRef: '2.14',
    preview:
      "The line about enduring like winter and summer — it sat with me all morning. Maybe that's the point.",
    mood: 'peaceful',
  },
];

const groups: Record<string, typeof mockEntries> = {
  Today: mockEntries.filter((e) => e.date === 'Today'),
  'This week': mockEntries.filter((e) => e.date === 'Yesterday' || e.date === 'Tuesday'),
  Earlier: mockEntries.filter(
    (e) => e.date !== 'Today' && e.date !== 'Yesterday' && e.date !== 'Tuesday',
  ),
};

export default function JournalListPage() {
  return (
    <>
      <Nav />
      <main className="py-12 md:py-16 relative">
        <Container size="md">
          <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-10">Journal</h1>

          {Object.entries(groups).map(([label, items]) =>
            items.length === 0 ? null : (
              <section key={label} className="mb-10">
                <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">{label}</p>
                <ul className="space-y-3">
                  {items.map((e) => (
                    <li key={e.id}>
                      <Link
                        href={`/me/journal/${e.id}`}
                        className="block p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gold-500 text-xs font-mono">
                            Verse {e.verseRef}
                          </span>
                          {e.mood && (
                            <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-300 text-xs">
                              {e.mood}
                            </span>
                          )}
                        </div>
                        <p className="font-display text-text-primary text-base italic line-clamp-2">
                          {e.preview}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ),
          )}
        </Container>

        <Link
          href="/me/journal/new"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gold-500 text-bg-base flex items-center justify-center text-xl hover:bg-gold-300 transition-colors shadow-lg glow-gold"
          aria-label="New entry"
        >
          ✎
        </Link>
      </main>
    </>
  );
}
