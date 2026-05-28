import Link from 'next/link';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockChapters } from '@/shared/data/mock-verses';

const currentDay = 7;

export default function ChallengePage() {
  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="md">
          <div className="text-center mb-12">
            <p className="text-gold-500 uppercase tracking-[0.3em] text-xs mb-3">
              18-Day Challenge
            </p>
            <h1 className="font-display text-3xl md:text-5xl text-text-primary mb-3">
              One chapter a day
            </h1>
            <p className="text-text-muted">Complete the Bhagavad Gita in 18 days.</p>
          </div>

          <div className="p-8 rounded-2xl bg-bg-surface/60 border border-gold-500/30 mb-12 text-center">
            <div className="relative inline-flex items-center justify-center mb-6">
              <svg width="160" height="160" className="transform -rotate-90" aria-hidden="true">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="rgba(201,168,76,0.15)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#C9A84C"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - currentDay / 18)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-display text-4xl text-gold-300">{currentDay}</p>
                <p className="text-text-muted text-xs uppercase tracking-[0.2em]">of 18</p>
              </div>
            </div>
            <p className="text-text-secondary mb-4">Today: read Chapter {currentDay + 1}</p>
            <Link
              href={`/chapter/${currentDay + 1}`}
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-gold-500 text-bg-base text-sm font-medium hover:bg-gold-300 transition-colors"
            >
              Open Chapter {currentDay + 1} →
            </Link>
          </div>

          <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-5">The journey</p>
          <div className="grid grid-cols-6 md:grid-cols-9 gap-3">
            {mockChapters.map((ch) => {
              const done = ch.number <= currentDay;
              const today = ch.number === currentDay + 1;
              return (
                <div
                  key={ch.number}
                  className="flex flex-col items-center"
                  title={`Day ${ch.number}: ${ch.titleEn}`}
                >
                  <div className={today ? 'animate-pulse' : ''}>
                    <Mandala
                      seed={ch.number}
                      size={48}
                      stroke={done ? '#C9A84C' : today ? '#E8D183' : 'rgba(201,168,76,0.2)'}
                    />
                  </div>
                  <p className="text-text-muted text-[10px] mt-1">D{ch.number}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </main>
    </>
  );
}
