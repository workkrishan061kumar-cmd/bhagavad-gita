'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { recordVerseView } from '../actions';

type Props = { chapter: number; verse: number };

/**
 * Fires recordVerseView once when a signed-in user lands on a verse page.
 * Renders nothing. Dedupes across React StrictMode double-effects with a ref.
 */
export function VerseViewTracker({ chapter, verse }: Props) {
  const { status } = useSession();
  const firedKey = useRef<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const key = `${chapter}.${verse}`;
    if (firedKey.current === key) return;
    firedKey.current = key;
    void recordVerseView({ chapter, verse });
  }, [status, chapter, verse]);

  return null;
}
