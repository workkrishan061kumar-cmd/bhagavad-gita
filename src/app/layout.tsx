// Minimal root layout. The real layout (html, body, fonts, providers) is in
// src/app/[locale]/layout.tsx since every visible route lives under [locale]
// via next-intl middleware.
//
// This file is still required by Next.js because not-found.tsx and other
// fallback files at root need a layout to render into.

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
