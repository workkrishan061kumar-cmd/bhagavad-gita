import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hi'] as const,
  defaultLocale: 'en',
  // 'as-needed' = English stays at root (/verse/2/47),
  // Hindi gets prefix (/hi/verse/2/47). Preserves existing share URLs.
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
