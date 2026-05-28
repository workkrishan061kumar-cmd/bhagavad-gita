import Link from 'next/link';

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-bg-base/80 border-b border-gold-500/10">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-gold-500 text-xl font-display tracking-wide group-hover:text-gold-300 transition-colors">
            Gita-Verse
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          <li>
            <Link href="/chapters" className="hover:text-gold-500 transition-colors">
              Chapters
            </Link>
          </li>
          <li>
            <Link href="/ask" className="hover:text-gold-500 transition-colors">
              Ask Krishna
            </Link>
          </li>
          <li>
            <Link href="/daily" className="hover:text-gold-500 transition-colors">
              Daily Verse
            </Link>
          </li>
          <li>
            <Link href="/library" className="hover:text-gold-500 transition-colors">
              Library
            </Link>
          </li>
        </ul>

        <Link
          href="/auth"
          className="text-sm px-4 py-2 rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition-colors"
        >
          Sign in
        </Link>
      </nav>
    </header>
  );
}
