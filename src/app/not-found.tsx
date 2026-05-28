import Link from 'next/link';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative py-16 md:py-24">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Mandala seed={404} size={480} className="text-gold-500/[0.05]" />
        </div>

        <Container size="sm" className="relative z-10 text-center">
          <p className="text-gold-500 text-6xl mb-6">·</p>
          <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-3">
            This verse seems missing.
          </h1>
          <p className="text-text-muted leading-relaxed mb-10">
            The page you&apos;re looking for isn&apos;t here. Maybe try one of these —
          </p>

          <ul className="space-y-3 mb-14">
            <li>
              <Link
                href="/chapter/1"
                className="block px-6 py-3 rounded-full bg-bg-surface/60 border border-gold-500/20 hover:border-gold-500/40 text-gold-500 transition-colors"
              >
                Start with Chapter 1 →
              </Link>
            </li>
            <li>
              <Link
                href="/ask"
                className="block px-6 py-3 rounded-full bg-bg-surface/60 border border-gold-500/20 hover:border-gold-500/40 text-gold-500 transition-colors"
              >
                Ask Krishna for guidance →
              </Link>
            </li>
            <li>
              <Link
                href="/daily"
                className="block px-6 py-3 rounded-full bg-bg-surface/60 border border-gold-500/20 hover:border-gold-500/40 text-gold-500 transition-colors"
              >
                Today&apos;s verse →
              </Link>
            </li>
          </ul>

          <div className="p-6 rounded-xl bg-bg-surface/30 border-l-2 border-gold-500/40 text-left max-w-md mx-auto">
            <p className="font-sanskrit text-text-sanskrit text-base mb-2">
              नेहाभिक्रमनाशोऽस्ति प्रत्यवायो न विद्यते
            </p>
            <p className="text-text-muted text-sm italic">
              On this path, no effort is wasted, no setback prevails.
            </p>
            <p className="text-text-muted/60 text-xs mt-2">— 2.40</p>
          </div>
        </Container>
      </main>
    </>
  );
}
