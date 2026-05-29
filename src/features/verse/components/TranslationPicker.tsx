'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

type LangOption = { code: string; name: string; nativeName: string };
type AuthorOption = { id: number; name: string; slug: string };

type Props = {
  availableLanguages: LangOption[];
  availableAuthorsByLang: Record<string, AuthorOption[]>;
  featuredAuthorByLang: Record<string, string>;
  currentLang: string;
  currentAuthor: string;
};

const STORAGE_KEY = 'gita-verse:translation-pref';

export function TranslationPicker({
  availableLanguages,
  availableAuthorsByLang,
  featuredAuthorByLang,
  currentLang,
  currentAuthor,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useRef(false);

  // On first mount: if URL has no lang/author params but localStorage has a
  // saved preference, apply it (so returning users land on their pick).
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-shot
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (searchParams.has('lang') || searchParams.has('author')) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { lang?: string; author?: string };
      if (!saved.lang || !saved.author) return;
      if (saved.lang === currentLang && saved.author === currentAuthor) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set('lang', saved.lang);
      params.set('author', saved.author);
      router.replace(`?${params.toString()}`, { scroll: false });
    } catch {
      // ignore — localStorage quota, JSON parse, anything
    }
  }, []);

  const writeParams = (lang: string, author: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    params.set('author', author);
    router.replace(`?${params.toString()}`, { scroll: false });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, author }));
    } catch {
      // ignore
    }
  };

  const handleLangChange = (nextLang: string) => {
    const candidates = availableAuthorsByLang[nextLang] ?? [];
    const featuredSlug = featuredAuthorByLang[nextLang];
    const nextAuthor =
      (featuredSlug && candidates.find((a) => a.slug === featuredSlug)?.slug) ??
      candidates[0]?.slug ??
      currentAuthor;
    writeParams(nextLang, nextAuthor);
  };

  const authorsForCurrent = availableAuthorsByLang[currentLang] ?? [];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
      <span className="text-gold-500/60 text-xs uppercase tracking-[0.2em] mr-1">Translation</span>
      <div className="relative">
        <select
          value={currentLang}
          onChange={(e) => handleLangChange(e.target.value)}
          aria-label="Translation language"
          className="appearance-none bg-bg-elevated border border-gold-500/30 text-text-primary rounded-full pl-3.5 pr-8 py-1.5 text-sm hover:border-gold-500/60 focus:border-gold-500 outline-none cursor-pointer"
        >
          {availableLanguages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name} · {l.nativeName}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold-500/70 text-xs"
          aria-hidden="true"
        >
          ▾
        </span>
      </div>
      <span className="text-text-muted text-xs">by</span>
      <div className="relative">
        <select
          value={currentAuthor}
          onChange={(e) => writeParams(currentLang, e.target.value)}
          aria-label="Translator"
          className="appearance-none bg-bg-elevated border border-gold-500/30 text-text-primary rounded-full pl-3.5 pr-8 py-1.5 text-sm hover:border-gold-500/60 focus:border-gold-500 outline-none cursor-pointer"
        >
          {authorsForCurrent.map((a) => (
            <option key={a.id} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold-500/70 text-xs"
          aria-hidden="true"
        >
          ▾
        </span>
      </div>
    </div>
  );
}
