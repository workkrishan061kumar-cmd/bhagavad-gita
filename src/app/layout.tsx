import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Tiro_Devanagari_Sanskrit } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Gita-Verse — Ancient wisdom. Daily guidance.',
    template: '%s · Gita-Verse',
  },
  description:
    'Read all 700 verses of the Bhagavad Gita with translations, commentaries, and AI-powered guidance for daily life.',
  keywords: ['Bhagavad Gita', 'Sanskrit', 'spirituality', 'meditation', 'Krishna', 'verses'],
  openGraph: {
    type: 'website',
    siteName: 'Gita-Verse',
    title: 'Gita-Verse — Ancient wisdom. Daily guidance.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0F1A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${tiro.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-body antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
