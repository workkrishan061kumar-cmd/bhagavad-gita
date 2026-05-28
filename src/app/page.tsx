import Link from 'next/link';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockChapters, mockVerses } from '@/shared/data/mock-verses';

const moods = [
  { key: 'anxious', label: 'Anxious' },
  { key: 'grateful', label: 'Grateful' },
  { key: 'confused', label: 'Confused' },
  { key: 'motivated', label: 'Motivated' },
  { key: 'grieving', label: 'Grieving' },
  { key: 'angry', label: 'Angry' },
  { key: 'peaceful', label: 'Peaceful' },
  { key: 'lost', label: 'Lost' },
] as const;

const features = [
  {
    title: 'Read all 700 verses',
    desc: 'Sanskrit, transliteration, translation, commentary — every verse, every chapter.',
  },
  {
    title: 'Ask Krishna',
    desc: 'Type a worry. Receive verses that speak to it. Free guidance, always.',
  },
  {
    title: 'Daily verse, your mood',
    desc: '8 moods, curated verses. A daily ritual that meets you where you are.',
  },
  {
    title: 'Reflect privately',
    desc: 'A journal tied to verses. Watch your understanding deepen week by week.',
  },
  {
    title: 'Share beautifully',
    desc: 'Every verse becomes a shareable card with a unique mandala.',
  },
  {
    title: 'WhatsApp daily',
    desc: 'Receive a verse every morning on the platform you already check.',
  },
];

export default function Home() {
  const sample = mockVerses['2.47'];
  if (!sample) return null;

  return (
    <>
      <Nav />

      <main className="relative">
        {/* HERO */}
        <section className="relative min-h-[88dvh] flex items-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Mandala seed={247} size={760} className="text-gold-500/[0.06]" />
          </div>

          <Container
            size="lg"
            className="relative z-10 py-16 grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-7">
              <p className="text-gold-500 uppercase tracking-[0.25em] text-xs font-medium">
                Wisdom for modern life
              </p>
              <h1 className="font-sanskrit text-text-sanskrit text-5xl sm:text-7xl leading-tight text-sanskrit-glow">
                श्रीमद्भगवद्गीता
              </h1>
              <p className="font-display text-2xl sm:text-4xl text-text-primary leading-snug">
                Ancient wisdom.
                <br />
                Daily guidance.
              </p>
              <p className="text-text-muted max-w-md">
                Read all 700 verses. Ask Krishna for guidance. Reflect on what speaks to you. Free,
                no ads, no paywall — ever.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/chapters"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-gold-500 text-bg-base font-medium hover:bg-gold-300 transition-colors"
                >
                  Start Reading
                </Link>
                <Link
                  href="/ask"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-gold-500 text-gold-500 font-medium hover:bg-gold-500/10 transition-colors"
                >
                  Ask Krishna →
                </Link>
              </div>
            </div>

            {/* Floating verse card */}
            <div className="hidden md:flex justify-end">
              <div className="relative p-8 rounded-2xl bg-bg-surface/80 border border-gold-500/20 glow-gold backdrop-blur-sm max-w-sm">
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gold-500 text-bg-base text-xs font-medium">
                  Chapter 2 · Verse 47
                </div>
                <div className="space-y-4 pt-2">
                  <p className="font-sanskrit text-text-sanskrit text-lg leading-relaxed whitespace-pre-line">
                    {sample.sanskrit}
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
                  <p className="text-text-muted text-sm italic">
                    {sample.transliteration.split('|')[0]}
                  </p>
                  <p className="font-display text-text-primary leading-relaxed">
                    You have a right to perform your prescribed duty, but you are not entitled to
                    the fruits of your action.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* DAILY MOOD STRIP */}
        <section className="border-y border-gold-500/10 bg-bg-surface/40">
          <Container size="lg" className="py-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-2">Today</p>
                <p className="font-display text-2xl text-text-primary">How are you feeling?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <Link
                    key={m.key}
                    href={`/daily?mood=${m.key}`}
                    className="px-4 py-2 rounded-full border border-gold-500/30 text-sm text-text-secondary hover:border-gold-500 hover:text-gold-500 transition-colors"
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* FEATURES */}
        <section className="py-24">
          <Container size="lg">
            <h2 className="font-display text-3xl sm:text-4xl text-text-primary text-center mb-3">
              Six ways the Gita meets you
            </h2>
            <p className="text-text-muted text-center mb-14 max-w-2xl mx-auto">
              Built to honour the text — and serve the person reading it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="p-6 rounded-xl bg-bg-surface border border-gold-500/10 hover:border-gold-500/30 transition-colors"
                >
                  <h3 className="font-display text-lg text-gold-300 mb-2">{f.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CHAPTERS PREVIEW */}
        <section className="py-20 bg-bg-surface/40 border-y border-gold-500/10">
          <Container size="lg">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-2">
                  Eighteen chapters
                </p>
                <h2 className="font-display text-3xl text-text-primary">
                  700 verses, one conversation
                </h2>
              </div>
              <Link
                href="/chapters"
                className="text-gold-500 text-sm hover:text-gold-300 transition-colors"
              >
                Explore all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {mockChapters.slice(0, 6).map((ch) => (
                <Link
                  key={ch.number}
                  href={`/chapter/${ch.number}`}
                  className="group p-4 rounded-xl bg-bg-elevated/40 border border-gold-500/10 hover:border-gold-500/40 hover:bg-bg-elevated transition-all flex flex-col items-center text-center gap-3"
                >
                  <Mandala
                    seed={ch.number}
                    size={80}
                    className="text-gold-500/40 group-hover:text-gold-500/70 transition-colors"
                  />
                  <div>
                    <p className="font-sanskrit text-text-sanskrit text-sm">{ch.titleSa}</p>
                    <p className="text-text-muted text-xs mt-1">{ch.titleEn}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-24">
          <Container size="md" className="text-center space-y-6">
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs">The 18-day challenge</p>
            <h2 className="font-display text-3xl sm:text-5xl text-text-primary">
              One chapter a day.
              <br />
              Complete the Gita in 18 days.
            </h2>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gold-500 text-bg-base font-medium hover:bg-gold-300 transition-colors"
            >
              Start the journey
            </Link>
          </Container>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gold-500/10 py-12 text-text-muted text-sm">
          <Container size="lg" className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="font-display text-gold-500 text-lg">Gita-Verse</p>
              <p className="mt-1">Built with devotion. Free, no ads, no paywall.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-gold-500">
                About
              </Link>
              <Link href="/donate" className="hover:text-gold-500">
                Donate
              </Link>
              <Link href="/legal/privacy" className="hover:text-gold-500">
                Privacy
              </Link>
              <Link href="/legal/terms" className="hover:text-gold-500">
                Terms
              </Link>
            </div>
          </Container>
        </footer>
      </main>
    </>
  );
}
