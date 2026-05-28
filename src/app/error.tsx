'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Container } from '@/shared/components/layout/Container';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: surface error in dev console
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[80dvh] flex items-center justify-center">
      <Container size="sm" className="text-center">
        <p className="text-saffron-500 text-5xl mb-6">⊘</p>
        <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-3">
          Something went sideways.
        </h1>
        <p className="text-text-muted leading-relaxed mb-10">
          Even Arjuna had moments of confusion. Try one of these —
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 rounded-full bg-gold-500 text-bg-base font-medium hover:bg-gold-300 transition-colors"
          >
            Reload the page
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border border-gold-500 text-gold-500 font-medium hover:bg-gold-500/10 transition-colors"
          >
            Start over from home
          </Link>
        </div>

        <p className="text-text-muted/60 text-xs">
          If this keeps happening,{' '}
          <Link href="mailto:hi@gitaverse.app" className="text-gold-500 hover:text-gold-300">
            drop us a line →
          </Link>
        </p>

        {process.env.NODE_ENV !== 'production' && (
          <details className="mt-12 text-left max-w-md mx-auto">
            <summary className="cursor-pointer text-text-muted text-xs">
              Error details (dev only)
            </summary>
            <pre className="mt-3 p-4 rounded-lg bg-bg-surface text-text-muted text-xs overflow-auto">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </Container>
    </main>
  );
}
