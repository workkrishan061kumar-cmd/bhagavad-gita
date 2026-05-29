'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import type { SearchResult } from '@/features/verse';
import { useRouter } from '@/i18n/navigation';

const DEBOUNCE_MS = 220;
const MIN_QUERY_LEN = 2;

function parseVerseRef(input: string): { chapter: number; verse: number } | null {
  const match = input.match(/^(\d{1,2})[.\-:/\s](\d{1,2})$/);
  if (!match || !match[1] || !match[2]) return null;
  const chapter = Number.parseInt(match[1], 10);
  const verse = Number.parseInt(match[2], 10);
  if (chapter < 1 || chapter > 18 || verse < 1 || verse > 78) return null;
  return { chapter, verse };
}

export function CommandPalette() {
  const router = useRouter();
  const t = useTranslations('search');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd/Ctrl+K listener.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((s) => !s);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus input on open + reset state on close.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery('');
      setResults([]);
      setActiveIdx(0);
    }
  }, [open]);

  // Debounced search.
  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LEN) {
      setResults([]);
      setLoading(false);
      return;
    }
    if (parseVerseRef(trimmed)) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=10`, {
          signal: controller.signal,
        });
        const data: { results: SearchResult[] } = await res.json();
        setResults(data.results ?? []);
        setActiveIdx(0);
      } catch {
        // ignore — likely aborted
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, open]);

  const ref = parseVerseRef(query.trim());
  const showResults = !ref && results.length > 0;
  const showNoResults =
    !ref && query.trim().length >= MIN_QUERY_LEN && !loading && results.length === 0;

  const handleNavigate = (chapter: number, verse: number) => {
    setOpen(false);
    router.push(`/verse/${chapter}/${verse}` as never);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (ref) handleNavigate(ref.chapter, ref.verse);
      else if (showResults && results[activeIdx]) {
        handleNavigate(results[activeIdx].chapterId, results[activeIdx].number);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('open')}
        className="text-text-muted/70 hover:text-gold-500 transition-colors p-2 rounded-full hover:bg-gold-500/10"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label={t('close')}
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm z-50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        className="fixed inset-x-4 top-[15dvh] z-50 max-w-2xl mx-auto rounded-2xl bg-bg-surface border border-gold-500/30 shadow-2xl overflow-hidden"
      >
        <div className="relative border-b border-gold-500/10">
          <span
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500/70"
            aria-hidden="true"
          >
            ⌕
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder={t('placeholder')}
            autoComplete="off"
            className="w-full bg-transparent pl-14 pr-14 py-5 text-text-primary placeholder:text-text-muted/60 outline-none text-base"
          />
          <kbd className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-text-muted/60 font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-[55dvh] overflow-y-auto p-2">
          {ref && (
            <button
              type="button"
              onClick={() => handleNavigate(ref.chapter, ref.verse)}
              className="block w-full text-left p-3 rounded-xl bg-bg-elevated/40 hover:bg-bg-elevated transition-colors"
            >
              <p className="text-gold-500 text-xs font-mono mb-1">
                {ref.chapter}.{ref.verse}
              </p>
              <p className="text-text-secondary text-sm">
                {t('jumpTo', { ref: `${ref.chapter}.${ref.verse}` })}
              </p>
            </button>
          )}

          {loading && <p className="text-text-muted text-sm p-4 text-center">{t('searching')}</p>}

          {showResults &&
            results.map((r, i) => (
              <button
                key={`${r.chapterId}.${r.number}`}
                type="button"
                onClick={() => handleNavigate(r.chapterId, r.number)}
                onMouseEnter={() => setActiveIdx(i)}
                className={
                  i === activeIdx
                    ? 'block w-full text-left p-3 rounded-xl bg-bg-elevated transition-colors'
                    : 'block w-full text-left p-3 rounded-xl hover:bg-bg-elevated/40 transition-colors'
                }
              >
                <div className="flex items-baseline justify-between mb-1">
                  <p className="text-gold-500 text-xs font-mono">
                    {r.chapterId}.{r.number}
                  </p>
                  <p className="text-text-muted/50 text-xs">
                    {r.authorName} · {r.languageCode.toUpperCase()}
                  </p>
                </div>
                <p className="text-text-secondary text-sm line-clamp-2">{r.text}</p>
              </button>
            ))}

          {showNoResults && (
            <p className="text-text-muted text-sm p-6 text-center">{t('noResults', { query })}</p>
          )}

          {!ref && query.trim().length < MIN_QUERY_LEN && (
            <p className="text-text-muted/60 text-xs p-4 text-center">{t('hint')}</p>
          )}
        </div>

        <div className="px-5 py-2.5 border-t border-gold-500/10 flex items-center justify-between text-xs text-text-muted/60">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono">↑↓</kbd> {t('navigate')}
            </span>
            <span>
              <kbd className="font-mono">↵</kbd> {t('select')}
            </span>
          </div>
          <span>
            <kbd className="font-mono">⌘K</kbd>
          </span>
        </div>
      </div>
    </>
  );
}
