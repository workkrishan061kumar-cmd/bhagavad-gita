import Link from 'next/link';
import { Mandala } from '@/shared/components/brand/Mandala';

export default function Home() {
  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
        <Mandala seed={247} size={720} className="text-gold-500" />
      </div>

      <div className="relative z-10 max-w-2xl text-center space-y-8">
        <p className="text-gold-500 uppercase tracking-[0.2em] text-xs font-medium">
          Wisdom for modern life
        </p>

        <h1 className="font-sanskrit text-text-sanskrit text-4xl sm:text-6xl text-sanskrit-glow">
          श्रीमद्भगवद्गीता
        </h1>

        <p className="font-display text-2xl sm:text-3xl text-text-primary">
          Ancient wisdom. Daily guidance.
        </p>

        <p className="text-text-muted max-w-md mx-auto">
          Read all 700 verses. Ask Krishna for guidance. Reflect on what speaks to you.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/chapters"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gold-500 text-bg-base font-medium hover:bg-gold-300 transition-colors"
          >
            Start Reading
          </Link>
          <Link
            href="/ask"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gold-500 text-gold-500 font-medium hover:bg-gold-500/10 transition-colors"
          >
            Ask Krishna →
          </Link>
        </div>

        <p className="text-text-muted/60 text-xs pt-12 font-mono">
          Scaffold ready. Day 1 complete.
        </p>
      </div>
    </main>
  );
}
