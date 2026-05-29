import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

const amounts = [100, 500, 1000];

const supporters = [
  { name: 'Aarti', note: 'for my morning practice' },
  { name: 'K.', note: 'thank you for keeping it free' },
  { name: 'Vivek', note: 'in memory of Amma' },
  { name: 'Priya', note: 'verse 2.47 changed my year' },
];

export default function DonatePage() {
  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="sm" className="text-center">
          <p className="text-3xl mb-3">🪔</p>
          <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
            Keep the lamp lit
          </h1>

          <div className="space-y-5 text-left text-text-secondary leading-relaxed mb-12">
            <p>
              Gita-Verse has no ads, no paywall, no premium tier. The scripture is free, and that
              will not change.
            </p>
            <p>
              Donations cover hosting, AI inference (gpt-4o-mini for Ask Krishna), Twilio for
              WhatsApp, and the time to curate translations. Roughly $40/month at our current size.
            </p>
            <p>
              One-time gifts only — we do not store payment info or set up recurring charges. Give
              what feels right.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {amounts.map((amt) => (
              <button
                key={amt}
                type="button"
                className="px-6 py-3 rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition-colors"
              >
                ₹{amt}
              </button>
            ))}
            <button
              type="button"
              className="px-6 py-3 rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition-colors"
            >
              Custom
            </button>
          </div>

          <button
            type="button"
            className="w-full max-w-xs mx-auto px-6 py-3.5 rounded-full bg-gold-500 text-bg-base font-medium hover:bg-gold-300 transition-colors"
          >
            Continue with Razorpay
          </button>

          <p className="text-text-muted text-xs mt-3">One-time gift. No recurring.</p>

          <div className="mt-16">
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-5">
              Recent supporters
            </p>
            <ul className="space-y-3 max-w-md mx-auto">
              {supporters.map((s) => (
                <li
                  key={`${s.name}-${s.note}`}
                  className="flex items-baseline gap-3 text-sm text-left p-3 rounded-lg bg-bg-surface/40"
                >
                  <span className="font-display text-gold-300 shrink-0">{s.name}</span>
                  <span className="text-text-muted italic">— {s.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </main>
    </>
  );
}
