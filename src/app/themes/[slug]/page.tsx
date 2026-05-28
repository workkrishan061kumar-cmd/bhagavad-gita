import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockVerses } from '@/shared/data/mock-verses';

type Params = Promise<{ slug: string }>;

const themeMeta: Record<string, { title: string; sa: string; intro: string }> = {
  duty: {
    title: 'On Duty',
    sa: 'धर्म',
    intro:
      'Dharma in the Gita is not blind obligation. It is action aligned with your nature, performed without grasping at its fruit.',
  },
  detachment: {
    title: 'On Detachment',
    sa: 'वैराग्य',
    intro:
      'Detachment is not coldness. It is full participation in life without being owned by its outcomes.',
  },
  fear: {
    title: 'On Fear',
    sa: 'भय',
    intro:
      'The Gita does not promise the absence of fear. It points to what stands behind fear — the self that does not perish.',
  },
};

const relatedThemes = ['duty', 'detachment', 'fear', 'surrender', 'equanimity', 'action'];

export default async function ThemePage({ params }: { params: Params }) {
  const { slug } = await params;
  const meta = themeMeta[slug] ?? { title: slug, sa: '', intro: 'Verses tagged with this theme:' };
  const verses = Object.values(mockVerses).filter((v) => v.themes.includes(slug));

  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="md">
          <Link
            href="/chapters"
            className="text-sm text-text-muted hover:text-gold-500 transition-colors"
          >
            ← Browse
          </Link>

          <div className="mt-8 mb-12">
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-3">Theme</p>
            <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-2">
              {meta.title}
            </h1>
            {meta.sa && <p className="font-sanskrit text-text-sanskrit text-2xl mb-4">{meta.sa}</p>}
            <p className="text-text-secondary leading-relaxed max-w-prose">{meta.intro}</p>
            <p className="text-text-muted text-xs mt-4">{verses.length} verses tagged</p>
          </div>

          {verses.length === 0 ? (
            <p className="text-text-muted text-center py-12">
              No verses tagged with &ldquo;{slug}&rdquo; yet. (Mock data is limited; real verses
              load when DB is seeded.)
            </p>
          ) : (
            <ul className="space-y-3">
              {verses.map((v) => (
                <li key={`${v.chapter}.${v.verse}`}>
                  <Link
                    href={`/verse/${v.chapter}/${v.verse}`}
                    className="block p-5 rounded-xl bg-bg-surface/60 border border-gold-500/10 hover:border-gold-500/40 transition-colors"
                  >
                    <p className="text-gold-500 text-xs font-mono mb-2">
                      {v.chapter}.{v.verse}
                    </p>
                    <p className="font-sanskrit text-text-sanskrit text-base mb-2">
                      {v.sanskrit.split('\n')[0]}
                    </p>
                    <p className="text-text-secondary text-sm line-clamp-2">{v.english}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12">
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-3">Related themes</p>
            <div className="flex flex-wrap gap-2">
              {relatedThemes
                .filter((t) => t !== slug)
                .map((t) => (
                  <Link
                    key={t}
                    href={`/themes/${t}`}
                    className="px-3 py-1.5 rounded-full border border-gold-500/30 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
                  >
                    {t}
                  </Link>
                ))}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
