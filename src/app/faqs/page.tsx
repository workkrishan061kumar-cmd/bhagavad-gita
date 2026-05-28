import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

const faqs = [
  {
    section: 'Reading & navigation',
    items: [
      {
        q: 'How do I find a specific verse?',
        a: 'Use the search bar (Cmd+K) or navigate by chapter from /chapters.',
      },
      {
        q: 'Can I read offline?',
        a: 'Yes. Gita-Verse is a PWA. Once you visit a verse, it stays cached on your device.',
      },
      {
        q: 'Which translation do you use?',
        a: 'We feature several public-domain translations side by side. Pick your default in Settings.',
      },
    ],
  },
  {
    section: 'Ask Krishna',
    items: [
      {
        q: 'Is Ask Krishna accurate?',
        a: 'It maps your question to verses semantically and explains with AI. Treat answers as starting points for reflection, not authoritative rulings.',
      },
      {
        q: 'Which AI model powers it?',
        a: 'GPT-4o-mini for explanations, OpenAI embeddings for verse search. Both are deliberately cheap so the feature stays free.',
      },
      {
        q: 'Is my question private?',
        a: 'Questions are anonymized in our cache to share answers across users. We do not link them to your account.',
      },
    ],
  },
  {
    section: 'Account & data',
    items: [
      {
        q: 'How do I export my data?',
        a: 'Settings → Privacy → Export. You get a JSON file with all bookmarks, journal entries, and settings.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes, fully, from Settings. We do not retain anything after deletion.',
      },
    ],
  },
  {
    section: 'WhatsApp daily verse',
    items: [
      {
        q: 'How do I opt in?',
        a: 'Settings → Notifications → WhatsApp. You follow Twilio sandbox instructions; we send a daily verse at 6:30 AM your local time.',
      },
      {
        q: 'Is it really free?',
        a: 'During v1, yes — we use Twilio Sandbox which is free in development. Production migration is paid (cents per conversation) and we will absorb the cost.',
      },
    ],
  },
  {
    section: 'Donate & contribute',
    items: [
      {
        q: 'Why is this free?',
        a: 'Because scripture should be. We accept donations to cover infrastructure but the platform is free forever.',
      },
      {
        q: 'How can I contribute?',
        a: 'Code contributions welcome at our GitHub. Or simply share Gita-Verse with one person.',
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="md">
          <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-3 text-center">
            Common questions
          </h1>
          <p className="text-text-muted text-center mb-12">Honest answers about how this works.</p>

          {faqs.map((section) => (
            <section key={section.section} className="mb-10">
              <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">
                {section.section}
              </p>
              <div className="rounded-2xl bg-bg-surface/60 border border-gold-500/10 divide-y divide-gold-500/10">
                {section.items.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="px-5 py-4 cursor-pointer flex items-center justify-between text-text-primary hover:text-gold-300 transition-colors">
                      <span>{item.q}</span>
                      <span className="text-gold-500 group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="text-center mt-12 p-6 rounded-xl bg-bg-elevated/40 border border-gold-500/20">
            <p className="text-text-muted mb-3">Still stuck?</p>
            <Link href="mailto:hi@gitaverse.app" className="text-gold-500 hover:text-gold-300">
              hi@gitaverse.app
            </Link>
          </div>
        </Container>
      </main>
    </>
  );
}
