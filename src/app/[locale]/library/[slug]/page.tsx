import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';
import { mockBooks } from '../page';

type Params = Promise<{ slug: string }>;

export default async function BookDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const book = mockBooks.find((b) => b.slug === slug);
  if (!book) return notFound();

  return (
    <>
      <Nav />
      <main className="py-12 md:py-20">
        <Container size="lg">
          <Link
            href="/library"
            className="text-sm text-text-muted hover:text-gold-500 transition-colors"
          >
            ← Library
          </Link>

          <div className="mt-10 grid md:grid-cols-[300px_1fr] gap-12 items-start">
            <div>
              <div
                className="aspect-[3/4] rounded-xl flex items-center justify-center border border-gold-500/30"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(11,15,26,0.85) 100%)',
                }}
              >
                <p className="font-display text-gold-300 text-center px-6 text-lg">{book.title}</p>
              </div>
              <button
                type="button"
                className="mt-5 w-full px-5 py-3 rounded-full bg-gold-500 text-bg-base text-sm font-medium hover:bg-gold-300 transition-colors"
              >
                Download PDF
              </button>
              <p className="text-center text-text-muted text-xs mt-2">
                {book.pages} pages · {book.sizeMb} MB
              </p>
            </div>

            <div>
              <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-2">
                {book.title}
              </h1>
              <p className="text-text-muted mb-6">{book.author}</p>

              <div className="prose prose-invert max-w-none space-y-4 text-text-secondary leading-relaxed">
                <p>{book.description}</p>
                <p>
                  This edition has been used by readers and scholars across decades. The
                  translator&apos;s approach favours clarity over poetic compression, making it
                  especially suitable for first readings.
                </p>
                <p>
                  All material is in the public domain or licensed for free distribution. We host it
                  here as a gift, not a service we sell.
                </p>
              </div>

              <div className="mt-10 p-5 rounded-xl bg-bg-surface/50 border-l-4 border-gold-500/60">
                <p className="font-display italic text-text-primary leading-relaxed">
                  &ldquo;Yoga is skill in action.&rdquo;
                </p>
                <p className="text-text-muted text-xs mt-2">— Chapter 2, Verse 50</p>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
