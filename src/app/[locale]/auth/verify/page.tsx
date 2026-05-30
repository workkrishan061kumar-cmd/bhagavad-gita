import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ email?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  return {
    title: t('verifyHeading'),
    description: t('verifyBody'),
    robots: { index: false, follow: false },
  };
}

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ locale }, { email }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'auth' });

  const body = email ? t('verifyBodyKnown', { email }) : t('verifyBody');

  return (
    <>
      <Nav />
      <main className="min-h-[80dvh] flex items-center justify-center px-6 py-16">
        <Container size="sm" className="w-full max-w-md">
          <div className="relative flex items-center justify-center mb-8">
            <Mandala seed={2050} size={180} className="text-gold-500/30" />
          </div>
          <h1 className="font-display text-3xl text-text-primary mb-3 text-center">
            {t('verifyHeading')}
          </h1>
          <p className="text-text-muted text-sm text-center mb-6 leading-relaxed">{body}</p>
          <p className="text-text-muted/60 text-xs text-center mb-10 leading-relaxed">
            {t('verifyHint')}
          </p>
          <div className="text-center">
            <Link
              href="/auth"
              className="text-gold-500 hover:text-gold-300 text-sm transition-colors"
            >
              {t('verifyBack')}
            </Link>
          </div>
        </Container>
      </main>
    </>
  );
}
