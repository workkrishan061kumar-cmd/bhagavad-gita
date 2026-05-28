import { notFound } from 'next/navigation';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ doc: string }>;

const docs: Record<string, { title: string; updated: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    updated: '2026-05-28',
    body: [
      'This is a placeholder privacy policy. Replace with real legal text before launch.',
      'We collect: your email (for sign-in), your bookmarks, journal entries (encrypted at rest), reading progress, mood logs, and Ask Krishna questions.',
      'We do not sell or share personal data. We do not run third-party trackers beyond Plausible (privacy-friendly analytics with no cookies).',
      'You can export or delete your data at any time from Settings → Privacy.',
      'Ask Krishna questions are anonymized and cached so identical questions are not re-billed against OpenAI. Cached answers are shared across users.',
      'For questions, email hi@gitaverse.app.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: '2026-05-28',
    body: [
      'This is a placeholder terms document. Replace with real legal text before launch.',
      'Gita-Verse is provided free of charge, as-is, with no warranty. By using it you agree not to abuse the service (rate limits apply on Ask Krishna).',
      'Ask Krishna is an AI guide. It is not authoritative scripture interpretation. Use answers as starting points for your own reflection.',
      'Translations featured here are in the public domain. Commentaries and chapter summaries are licensed CC-BY-SA.',
      'You retain all rights to your journal entries and bookmarks. They belong to you and you can export them anytime.',
    ],
  },
};

const toc = ['About', 'What we collect', 'How we use it', 'Your rights', 'Contact'];

export default async function LegalPage({ params }: { params: Params }) {
  const { doc } = await params;
  const data = docs[doc];
  if (!data) return notFound();

  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="lg">
          <div className="grid md:grid-cols-[1fr_220px] gap-10">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-2">
                {data.title}
              </h1>
              <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-10">
                Last updated · {data.updated}
              </p>

              <div className="space-y-6 text-text-secondary leading-relaxed">
                {data.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            <aside className="hidden md:block">
              <div className="sticky top-24">
                <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">Contents</p>
                <ul className="space-y-2 text-sm">
                  {toc.map((item, i) => (
                    <li key={item}>
                      <a
                        href={`#section-${i}`}
                        className="flex items-center gap-2 text-text-muted hover:text-gold-500 transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-gold-500/40" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}
