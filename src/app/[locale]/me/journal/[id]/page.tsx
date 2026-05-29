import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockVerses } from '@/shared/data/mock-verses';

type Params = Promise<{ id: string }>;

export default async function JournalEntryPage({ params }: { params: Params }) {
  const { id } = await params;
  const verse = mockVerses['2.47'];
  if (!verse) return null;

  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="sm">
          <Link
            href="/me/journal"
            className="text-sm text-text-muted hover:text-gold-500 transition-colors"
          >
            ← All entries
          </Link>

          {/* Verse this reflects on */}
          <details className="mt-8 p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10" open>
            <summary className="cursor-pointer text-gold-500 text-sm font-mono">
              Reflecting on Verse {verse.chapter}.{verse.verse}
            </summary>
            <div className="mt-4 space-y-3">
              <p className="font-sanskrit text-text-sanskrit text-base">
                {verse.sanskrit.split('\n')[0]}
              </p>
              <p className="text-text-secondary text-sm italic">{verse.english}</p>
            </div>
          </details>

          {/* Date + mood */}
          <div className="flex items-center gap-3 mt-8 mb-4 text-sm">
            <span className="text-text-muted">Entry #{id} · Today, 8:42 AM</span>
            <div className="flex gap-1">
              {['reflective', 'grateful'].map((m) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-300 text-xs"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Editor */}
          <textarea
            rows={14}
            defaultValue={
              "Reading this again, I noticed something — the verse isn't about giving up on outcomes, it's about not letting them own you. There's a difference between caring about results and being controlled by them.\n\nToday I'm going to try the second."
            }
            className="w-full bg-transparent border-none outline-none font-display text-text-primary text-lg leading-relaxed resize-none focus:outline-none placeholder:text-text-muted/40"
            placeholder="Write a reflection…"
          />

          {/* Status */}
          <div className="mt-6 flex items-center justify-between text-text-muted/70 text-xs">
            <p>Saved 2 minutes ago</p>
            <button type="button" className="hover:text-red-400 transition-colors">
              Delete
            </button>
          </div>
        </Container>
      </main>
    </>
  );
}
