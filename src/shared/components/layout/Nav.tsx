import { useTranslations } from 'next-intl';
import { UserPill } from '@/features/auth/components/UserPill';
import { Link } from '@/i18n/navigation';
import { CommandPalette } from './CommandPalette';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Nav() {
  const t = useTranslations('nav');

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-bg-base/80 border-b border-gold-500/10">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="text-gold-500 text-xl font-display tracking-wide group-hover:text-gold-300 transition-colors">
            Gita-Verse
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          <li>
            <Link href="/chapters" className="hover:text-gold-500 transition-colors">
              {t('chapters')}
            </Link>
          </li>
          <li>
            <Link href="/ask" className="hover:text-gold-500 transition-colors">
              {t('ask')}
            </Link>
          </li>
          <li>
            <Link href="/daily" className="hover:text-gold-500 transition-colors">
              {t('daily')}
            </Link>
          </li>
          <li>
            <Link href="/library" className="hover:text-gold-500 transition-colors">
              {t('library')}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <CommandPalette />
          <LanguageSwitcher />
          <UserPill />
        </div>
      </nav>
    </header>
  );
}
