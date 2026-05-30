'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { createJournalEntry, deleteJournalEntry, updateJournalEntry } from '../actions';
import { moodOptions } from '../schemas';

type Status = 'idle' | 'saving' | 'saved' | 'error';

type CommonProps = {
  chapter: number;
  verse: number;
  initialContent: string;
  initialMood: string | null;
};

type ExistingProps = CommonProps & { mode: 'existing'; entryId: number };
type NewProps = CommonProps & { mode: 'new'; entryId?: undefined };
type Props = ExistingProps | NewProps;

const AUTOSAVE_DEBOUNCE_MS = 1500;

export function JournalEditor(props: Props) {
  const t = useTranslations('journal');
  const tMood = useTranslations('moods');
  const router = useRouter();

  const [content, setContent] = useState(props.initialContent);
  const [mood, setMood] = useState<string | null>(props.initialMood);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const entryIdRef = useRef<number | null>(props.mode === 'existing' ? props.entryId : null);
  const lastSavedRef = useRef({ content: props.initialContent, mood: props.initialMood });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    async ({ nextContent, nextMood }: { nextContent: string; nextMood: string | null }) => {
      const trimmed = nextContent.trim();
      if (trimmed.length === 0) return;
      if (
        trimmed === lastSavedRef.current.content.trim() &&
        nextMood === lastSavedRef.current.mood
      ) {
        return;
      }
      setStatus('saving');
      setErrorMessage(null);
      const existingId = entryIdRef.current;
      if (existingId !== null) {
        const result = await updateJournalEntry({
          id: existingId,
          content: nextContent,
          mood: nextMood,
        });
        if (result.ok) {
          lastSavedRef.current = { content: nextContent, mood: nextMood };
          setStatus('saved');
        } else {
          setStatus('error');
          setErrorMessage(result.error);
        }
      } else {
        const result = await createJournalEntry({
          chapter: props.chapter,
          verse: props.verse,
          content: nextContent,
          mood: nextMood,
        });
        if (result.ok) {
          entryIdRef.current = result.data.id;
          lastSavedRef.current = { content: nextContent, mood: nextMood };
          setStatus('saved');
          // Quietly upgrade the URL so the editor reflects the persistent entry id.
          router.replace(`/me/journal/${result.data.id}`);
        } else {
          setStatus('error');
          setErrorMessage(result.error);
        }
      }
    },
    [props.chapter, props.verse, router],
  );

  // Debounced auto-save whenever content or mood changes.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void persist({ nextContent: content, nextMood: mood });
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, mood, persist]);

  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    void persist({ nextContent: content, nextMood: mood });
  };

  const toggleMood = (m: string) => {
    setMood((prev) => (prev === m ? null : m));
  };

  const handleDelete = () => {
    const existingId = entryIdRef.current;
    if (existingId === null) {
      router.push('/me/journal');
      return;
    }
    if (typeof window !== 'undefined' && !window.confirm(t('deleteConfirm'))) return;
    startTransition(async () => {
      const result = await deleteJournalEntry({ id: existingId });
      if (result.ok) {
        router.push('/me/journal');
      } else {
        setStatus('error');
        setErrorMessage(result.error);
      }
    });
  };

  let statusLabel: string;
  switch (status) {
    case 'saving':
      statusLabel = t('saving');
      break;
    case 'saved':
      statusLabel = t('savedJustNow');
      break;
    case 'error':
      statusLabel = errorMessage
        ? t('saveErrorWithReason', { reason: errorMessage })
        : t('saveError');
      break;
    default:
      statusLabel = '';
  }

  return (
    <>
      {/* Mood selector */}
      <div className="flex flex-wrap gap-2 mt-8 mb-4 text-sm">
        {moodOptions.map((m) => {
          const active = mood === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => toggleMood(m)}
              className={
                active
                  ? 'px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500 text-gold-300 text-xs transition-colors'
                  : 'px-3 py-1 rounded-full border border-gold-500/15 text-text-muted hover:border-gold-500/40 hover:text-gold-300 text-xs transition-colors'
              }
            >
              {tMood(m)}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        rows={14}
        placeholder={t('placeholder')}
        className="w-full bg-transparent border-none outline-none font-display text-text-primary text-lg leading-relaxed resize-y focus:outline-none placeholder:text-text-muted/40"
      />

      {/* Status row */}
      <div className="mt-6 flex items-center justify-between text-text-muted/70 text-xs">
        <p aria-live="polite" className={status === 'error' ? 'text-saffron-400' : ''}>
          {statusLabel}
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="hover:text-saffron-400 transition-colors disabled:opacity-50"
        >
          {entryIdRef.current === null ? t('cancel') : t('delete')}
        </button>
      </div>
    </>
  );
}
