import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSession } from '@/features/auth';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { MagicLinkForm } from '@/features/auth/components/MagicLinkForm';
import { Link, redirect } from '@/i18n/navigation';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type SearchParams = Promise<{ callbackUrl?: string; error?: string }>;
type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  return {
    title: t('welcome'),
    description: t('subtitle'),
    robots: { index: false, follow: false },
    alternates: {
      canonical: locale === 'en' ? '/auth' : `/${locale}/auth`,
      languages: { en: '/auth', hi: '/hi/auth', 'x-default': '/auth' },
    },
  };
}

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ locale }, { callbackUrl, error }, session] = await Promise.all([
    params,
    searchParams,
    getSession(),
  ]);

  setRequestLocale(locale);

  if (session?.user) {
    redirect({ href: callbackUrl ?? '/me', locale });
  }

  const t = await getTranslations({ locale, namespace: 'auth' });

  return (
    <>
      <Nav />
      <main className="min-h-[80dvh] grid md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-bg-surface/40 border-r border-gold-500/10 relative overflow-hidden">
          <Mandala seed={9999} size={520} className="text-gold-500/[0.12]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
            <p className="font-sanskrit text-text-sanskrit text-3xl mb-4">योग: कर्मसु कौशलम्</p>
            <p className="font-display text-text-secondary text-lg italic">{t('verseLine')}</p>
            <p className="text-text-muted text-sm mt-2">{t('verseRef')}</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16">
          <Container size="sm" className="w-full max-w-md">
            <h1 className="font-display text-3xl text-text-primary mb-2 text-center">
              {t('welcome')}
            </h1>
            <p className="text-text-muted text-sm text-center mb-10">{t('subtitle')}</p>

            {error ? (
              <div
                className="mb-6 p-4 rounded-2xl border border-saffron-400/40 bg-saffron-400/5 text-saffron-400 text-sm"
                role="alert"
              >
                <p className="font-medium mb-1">{t('errorTitle')}</p>
                <p className="text-text-muted">{t('errorGeneric')}</p>
              </div>
            ) : null}

            <GoogleSignInButton callbackUrl={callbackUrl} />

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gold-500/20" />
              <p className="text-text-muted text-xs">{t('or')}</p>
              <div className="flex-1 h-px bg-gold-500/20" />
            </div>

            <MagicLinkForm callbackUrl={callbackUrl} />

            <p className="hidden text-text-muted/60 text-xs text-center mt-8 leading-relaxed">
              {t('termsLine')}{' '}
              <Link href="/legal/terms" className="text-gold-500 hover:text-gold-300">
                {t('terms')}
              </Link>{' '}
              {t('and')}{' '}
              <Link href="/legal/privacy" className="text-gold-500 hover:text-gold-300">
                {t('privacy')}
              </Link>
              .
            </p>
          </Container>
        </div>
      </main>
    </>
  );
}
