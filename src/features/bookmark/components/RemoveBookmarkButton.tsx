'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { removeBookmark } from '../actions';

type Props = { chapter: number; verse: number };

export function RemoveBookmarkButton({ chapter, verse }: Props) {
  const t = useTranslations('bookmarks');
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await removeBookmark({ chapter, verse });
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={t('remove')}
      title={t('remove')}
      className="shrink-0 text-gold-500 hover:text-saffron-400 transition-colors disabled:opacity-50"
    >
      ♥
    </button>
  );
}
