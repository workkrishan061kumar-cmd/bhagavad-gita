import Link from 'next/link';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="relative py-16 md:py-24">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Mandala seed={1866} size={620} className="text-gold-500/[0.04]" />
        </div>

        <Container size="sm" className="relative z-10 space-y-12">
          <div className="text-center">
            <p className="font-sanskrit text-text-sanskrit text-2xl mb-3">सर्वधर्मान्परित्यज्य</p>
            <p className="text-text-muted italic">
              &ldquo;Surrender all dharmas — find rest.&rdquo;
            </p>
          </div>

          <section>
            <h2 className="font-display text-2xl text-text-primary mb-4">
              What is the Bhagavad Gita?
            </h2>
            <p className="text-text-secondary leading-relaxed">
              The Bhagavad Gita is a 700-verse dialogue between Prince Arjuna and Krishna, set on
              the battlefield of Kurukshetra around 2,500 years ago. It is the most-read scripture
              in the world after the Bible, and yet — paradoxically — the least understood, because
              most encounters with it are either dry academic translations or religious-org sites
              that bury its radical practical psychology under ritual.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mb-4">Why Gita-Verse?</h2>
            <p className="text-text-secondary leading-relaxed">
              Because the Gita meets you where you are — anxious before an exam, grieving a loss,
              stuck between two careers — and most existing readings don&apos;t let you bring those
              questions to it. We built this so anyone can find a verse for what they&apos;re
              feeling, in seconds, in beautiful form, with an AI guide to surface what the text says
              when you ask in your own words.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mb-4">Our principles</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="text-gold-500 font-display text-xl">1.</span>
                <div>
                  <p className="text-text-primary font-medium">Free, forever.</p>
                  <p className="text-text-muted text-sm">
                    Scripture has no business behind a paywall.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-gold-500 font-display text-xl">2.</span>
                <div>
                  <p className="text-text-primary font-medium">Scripture verbatim.</p>
                  <p className="text-text-muted text-sm">
                    We use established public-domain translations. We do not paraphrase verses.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-gold-500 font-display text-xl">3.</span>
                <div>
                  <p className="text-text-primary font-medium">Reverence over engagement.</p>
                  <p className="text-text-muted text-sm">
                    No dark patterns. No streak guilt. No notifications you didn&apos;t ask for.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <div className="text-center pt-6">
            <Link
              href="/chapter/1"
              className="inline-flex items-center px-7 py-3 rounded-full border border-gold-500 text-gold-500 text-sm font-medium hover:bg-gold-500/10 transition-colors"
            >
              Start with Chapter 1 →
            </Link>
          </div>
        </Container>
      </main>
    </>
  );
}
