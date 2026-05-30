import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllChapters } from '@/features/chapter';
import { getVerse } from '@/features/verse';
import { Link } from '@/i18n/navigation';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

const moodKeys = [
  'anxious',
  'grateful',
  'confused',
  'motivated',
  'grieving',
  'angry',
  'peaceful',
  'lost',
] as const;

const featureKeys = ['read', 'ask', 'daily', 'reflect', 'share', 'whatsapp'] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [sample, chapters, tHome, tMoods, tFeatures, tFooter] = await Promise.all([
    getVerse({ chapter: 2, verse: 47 }),
    getAllChapters(),
    getTranslations('home'),
    getTranslations('moods'),
    getTranslations('features'),
    getTranslations('footer'),
  ]);
  if (!sample) return null;

  const featuredEn = sample.translations.find((tr) => tr.language.code === 'en' && tr.isFeatured);

  return (
    <>
      <Nav />

      <main className="relative">
        {/* HERO */}
        <section className="relative min-h-[88dvh] flex items-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Mandala seed={2047} size={760} className="text-gold-500/[0.06]" />
          </div>

          <Container
            size="lg"
            className="relative z-10 py-16 grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-7">
              <p className="text-gold-500 uppercase tracking-[0.25em] text-xs font-medium">
                {tHome('kicker')}
              </p>
              <h1 className="font-sanskrit text-text-sanskrit text-5xl sm:text-7xl leading-tight text-sanskrit-glow">
                श्रीमद्भगवद्गीता
              </h1>
              <p className="font-display text-2xl sm:text-4xl text-text-primary leading-snug">
                {tHome('tagline1')}
                <br />
                {tHome('tagline2')}
              </p>
              <p className="text-text-muted max-w-md">{tHome('description')}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/chapters"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-gold-500 text-bg-base font-medium hover:bg-gold-300 transition-colors"
                >
                  {tHome('ctaPrimary')}
                </Link>
                <Link
                  href="/ask"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-gold-500 text-gold-500 font-medium hover:bg-gold-500/10 transition-colors"
                >
                  {tHome('ctaSecondary')}
                </Link>
              </div>
            </div>

            {/* Floating verse card */}
            <div className="hidden md:flex justify-end">
              <div className="relative p-8 rounded-2xl bg-bg-surface/80 border border-gold-500/20 glow-gold backdrop-blur-sm max-w-sm">
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gold-500 text-bg-base text-xs font-medium">
                  {sample.chapter.number} · {sample.number}
                </div>
                <div className="space-y-4 pt-2">
                  <p className="font-sanskrit text-text-sanskrit text-lg leading-relaxed whitespace-pre-line">
                    {sample.sanskrit}
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
                  <p className="text-text-muted text-sm italic line-clamp-2">
                    {sample.transliteration.split('\n')[0]}
                  </p>
                  {featuredEn && (
                    <p className="font-display text-text-primary leading-relaxed line-clamp-3">
                      {featuredEn.text}
                    </p>
                  )}
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
                <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-2">
                  {tHome('todayKicker')}
                </p>
                <p className="font-display text-2xl text-text-primary">{tHome('moodQuestion')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {moodKeys.map((mood) => (
                  <Link
                    key={mood}
                    href={`/daily?mood=${mood}`}
                    className="px-4 py-2 rounded-full border border-gold-500/30 text-sm text-text-secondary hover:border-gold-500 hover:text-gold-500 transition-colors"
                  >
                    {tMoods(mood)}
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
              {tHome('featuresHeading')}
            </h2>
            <p className="text-text-muted text-center mb-14 max-w-2xl mx-auto">
              {tHome('featuresSubheading')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featureKeys.map((key) => (
                <div
                  key={key}
                  className="p-6 rounded-xl bg-bg-surface border border-gold-500/10 hover:border-gold-500/30 transition-colors"
                >
                  <h3 className="font-display text-lg text-gold-300 mb-2">
                    {tFeatures(`${key}Title`)}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {tFeatures(`${key}Desc`)}
                  </p>
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
                  {tHome('chaptersKicker')}
                </p>
                <h2 className="font-display text-3xl text-text-primary">
                  {tHome('chaptersHeading')}
                </h2>
              </div>
              <Link
                href="/chapters"
                className="text-gold-500 text-sm hover:text-gold-300 transition-colors"
              >
                {tHome('chaptersExploreAll')}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {chapters.slice(0, 6).map((ch) => (
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
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs">
              {tHome('challengeKicker')}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl text-text-primary">
              {tHome('challengeHeading1')}
              <br />
              {tHome('challengeHeading2')}
            </h2>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gold-500 text-bg-base font-medium hover:bg-gold-300 transition-colors"
            >
              {tHome('challengeCta')}
            </Link>
          </Container>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gold-500/10 py-12 text-text-muted text-sm">
          <Container size="lg" className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="font-display text-gold-500 text-lg">Gita-Verse</p>
              <p className="mt-1">{tHome('footerTagline')}</p>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-gold-500">
                {tFooter('about')}
              </Link>
              <Link href="/donate" className="hover:text-gold-500">
                {tFooter('donate')}
              </Link>
              <Link href="/legal/privacy" className="hover:text-gold-500">
                {tFooter('privacy')}
              </Link>
              <Link href="/legal/terms" className="hover:text-gold-500">
                {tFooter('terms')}
              </Link>
            </div>
          </Container>
        </footer>
      </main>
    </>
  );
}
