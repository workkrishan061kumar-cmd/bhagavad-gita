'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('nav');

  const currentLocale = (params.locale as string) || routing.defaultLocale;
  const otherLocale = currentLocale === 'en' ? 'hi' : 'en';

  const label = otherLocale === 'hi' ? 'हि' : 'EN';

  const handleSwitch = () => {
    const search = searchParams.toString();
    const href = search ? `${pathname}?${search}` : pathname;
    // biome-ignore lint/suspicious/noExplicitAny: locale param typed via routing
    router.replace(href as any, { locale: otherLocale as 'en' | 'hi' });
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      aria-label={t('switchLanguage')}
      className="text-sm px-3 py-1.5 rounded-full border border-gold-500/30 text-gold-500/80 hover:border-gold-500 hover:text-gold-500 transition-colors font-mono"
    >
      {label}
    </button>
  );
}
