import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Tiro_Devanagari_Sanskrit } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const tiro = Tiro_Devanagari_Sanskrit({
  variable: '--font-tiro',
  weight: '400',
  subsets: ['devanagari', 'latin'],
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // hasLocale narrows the type to the literal union ('en' | 'hi').
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

  // Localized site metadata.
  const t = await getTranslations({ locale: validLocale, namespace: 'meta' }).catch(() => null);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
    title: {
      default: t?.('siteTitle') ?? 'Gita-Verse — Ancient wisdom. Daily guidance.',
      template: '%s · Gita-Verse',
    },
    description:
      t?.('siteDescription') ??
      'Read all 700 verses of the Bhagavad Gita with translations, commentaries, and AI-powered guidance for daily life.',
    keywords: [
      'Bhagavad Gita',
      'Sanskrit',
      'spirituality',
      'meditation',
      'Krishna',
      'verses',
      'भगवद्गीता',
    ],
    alternates: {
      // Home-page-level alternates. Per-page alternates added at page level.
      canonical: validLocale === routing.defaultLocale ? '/' : `/${validLocale}`,
      languages: {
        en: '/',
        hi: '/hi',
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Gita-Verse',
      title: t?.('siteTitle') ?? 'Gita-Verse — Ancient wisdom. Daily guidance.',
      locale: validLocale === 'hi' ? 'hi_IN' : 'en_US',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#0B0F1A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

// Pre-render both locales statically.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${tiro.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-body antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
