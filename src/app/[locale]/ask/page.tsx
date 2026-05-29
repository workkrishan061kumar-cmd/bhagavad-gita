import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

const suggestions = ['fear', 'grief', 'purpose', 'forgiveness'];

export default function AskKrishnaPage() {
  return (
    <>
      <Nav />

      <main className="min-h-[80dvh] flex items-center justify-center">
        <Container size="md" className="py-16 text-center">
          {/* Kicker */}
          <p className="text-text-muted italic text-sm mb-10">Ask anything weighing on you</p>

          {/* The orb */}
          <div className="relative mx-auto w-60 h-60 mb-12">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at center, #E8D183 0%, #C9A84C 35%, #F97316 80%, transparent 100%)',
                filter: 'blur(0px)',
                boxShadow:
                  '0 0 80px -10px rgba(249, 115, 22, 0.5), 0 0 40px -5px rgba(201, 168, 76, 0.5)',
                animation: 'orb-pulse 3.4s ease-in-out infinite',
              }}
            />
            <style>{`
              @keyframes orb-pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.04); opacity: 0.95; }
              }
            `}</style>
          </div>

          {/* Input */}
          <form className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="I'm scared of failing my exam..."
                className="w-full bg-transparent border-b border-gold-500/50 focus:border-gold-500 outline-none py-4 pr-12 text-text-primary text-lg placeholder:text-text-muted/60 text-center transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-gold-500 hover:bg-gold-500/10 transition-colors"
                aria-label="Ask"
              >
                →
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="px-4 py-1.5 rounded-full border border-gold-500/30 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="mt-24 text-xs text-text-muted/50 max-w-md mx-auto leading-relaxed">
            Krishna is an AI guide. Treat answers as a starting point for reflection.
          </p>
        </Container>
      </main>
    </>
  );
}
