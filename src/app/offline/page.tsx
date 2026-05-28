import Link from 'next/link';
import { Container } from '@/shared/components/layout/Container';

export default function OfflinePage() {
  return (
    <main className="min-h-dvh flex items-center justify-center">
      <Container size="sm" className="text-center">
        <p className="text-gold-500 text-5xl mb-6">⊙</p>
        <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-3">
          You&apos;re offline.
        </h1>
        <p className="text-text-muted leading-relaxed mb-10">
          But the Gita is still here. Here&apos;s what you can read while disconnected.
        </p>

        <div className="space-y-3 mb-12">
          {['Chapter 2 · Sankhya Yoga', 'Chapter 12 · Bhakti Yoga', 'Your bookmarked verses'].map(
            (label) => (
              <Link
                key={label}
                href="/chapter/2"
                className="block p-4 rounded-xl bg-bg-surface/60 border border-gold-500/20 hover:border-gold-500/40 text-text-secondary text-sm transition-colors"
              >
                {label} →
              </Link>
            ),
          )}
        </div>

        <div className="p-5 rounded-xl bg-bg-surface/30 border-l-2 border-gold-500/40 text-left">
          <p className="font-sanskrit text-text-sanskrit text-base mb-2">तांस्तितिक्षस्व भारत</p>
          <p className="text-text-muted text-sm italic">Endure them, O Bhārata.</p>
          <p className="text-text-muted/60 text-xs mt-2">— 2.14</p>
        </div>
      </Container>
    </main>
  );
}
