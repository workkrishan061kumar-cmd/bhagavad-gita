'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useOptimistic, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { toggleBookmark } from '../actions';

type Props = {
  chapter: number;
  verse: number;
  initialBookmarked: boolean;
};

export function BookmarkButton({ chapter, verse, initialBookmarked }: Props) {
  const t = useTranslations('verse');
  const router = useRouter();
  const { status } = useSession();
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic<boolean, boolean>(
    initialBookmarked,
    (_state, next) => next,
  );

  const handleClick = () => {
    if (status !== 'authenticated') {
      router.push(`/auth?callbackUrl=/verse/${chapter}/${verse}`);
      return;
    }
    startTransition(async () => {
      setOptimistic(!optimistic);
      const result = await toggleBookmark({ chapter, verse });
      if (!result.ok) {
        setOptimistic(initialBookmarked);
      }
    });
  };

  const filled = optimistic;
  const label = filled ? t('bookmarked') : t('bookmark');

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={filled}
      aria-label={label}
      className={
        filled
          ? 'px-5 py-2.5 rounded-full bg-gold-500/15 border border-gold-500 text-gold-500 text-sm transition-colors disabled:opacity-60'
          : 'px-5 py-2.5 rounded-full border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors disabled:opacity-60'
      }
    >
      <span aria-hidden="true" className="mr-1">
        {filled ? '♥' : '♡'}
      </span>
      {label}
    </button>
  );
}
