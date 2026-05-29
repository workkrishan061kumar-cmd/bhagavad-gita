import Link from 'next/link';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

export default function AuthPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[80dvh] grid md:grid-cols-2">
        {/* Decorative side */}
        <div className="hidden md:flex items-center justify-center bg-bg-surface/40 border-r border-gold-500/10 relative overflow-hidden">
          <Mandala seed={9999} size={520} className="text-gold-500/[0.12]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
            <p className="font-sanskrit text-text-sanskrit text-3xl mb-4">योग: कर्मसु कौशलम्</p>
            <p className="font-display text-text-secondary text-lg italic">
              Yoga is skill in action.
            </p>
            <p className="text-text-muted text-sm mt-2">— 2.50</p>
          </div>
        </div>

        {/* Form side */}
        <div className="flex items-center justify-center px-6 py-16">
          <Container size="sm" className="w-full max-w-md">
            <h1 className="font-display text-3xl text-text-primary mb-2 text-center">Welcome</h1>
            <p className="text-text-muted text-sm text-center mb-10">
              Sign in to bookmark, reflect, and receive your daily verse.
            </p>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-full border border-gold-500/40 text-text-primary hover:bg-gold-500/10 transition-colors"
            >
              <span className="text-base">G</span>
              <span>Continue with Google</span>
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gold-500/20" />
              <p className="text-text-muted text-xs">or</p>
              <div className="flex-1 h-px bg-gold-500/20" />
            </div>

            <form className="space-y-3">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-bg-surface border border-gold-500/20 focus:border-gold-500 outline-none rounded-full px-5 py-3 text-text-primary placeholder:text-text-muted/60 transition-colors"
              />
              <button
                type="submit"
                className="w-full px-5 py-3 rounded-full bg-gold-500 text-bg-base font-medium hover:bg-gold-300 transition-colors"
              >
                Send magic link
              </button>
            </form>

            <p className="text-text-muted/60 text-xs text-center mt-8 leading-relaxed">
              By signing in you agree to our{' '}
              <Link href="/legal/terms" className="text-gold-500 hover:text-gold-300">
                terms
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="text-gold-500 hover:text-gold-300">
                privacy policy
              </Link>
              .
            </p>
          </Container>
        </div>
      </main>
    </>
  );
}
