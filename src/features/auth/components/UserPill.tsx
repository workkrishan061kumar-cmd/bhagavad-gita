'use client';

import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

function initials(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '·';
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + second).toUpperCase() || trimmed[0]?.toUpperCase() || '·';
}

export function UserPill() {
  const t = useTranslations('nav');
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div
        aria-hidden="true"
        className="size-9 rounded-full border border-gold-500/20 bg-bg-surface animate-pulse"
      />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth"
        className="text-sm px-4 py-2 rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition-colors"
      >
        {t('signIn')}
      </Link>
    );
  }

  const user = session.user;
  const displayName = user.name ?? user.email ?? '?';

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/me"
        aria-label={t('myDashboard')}
        title={displayName}
        className="size-9 rounded-full overflow-hidden border border-gold-500/40 hover:border-gold-500 transition-colors flex items-center justify-center bg-bg-surface"
      >
        {user.image ? (
          // biome-ignore lint/performance/noImgElement: third-party avatar, no Next image-domain config yet
          <img
            src={user.image}
            alt={displayName}
            width={36}
            height={36}
            className="size-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-gold-500 text-xs font-medium">{initials(displayName)}</span>
        )}
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-sm px-4 py-2 rounded-full border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition-colors"
      >
        {t('signOut')}
      </button>
    </div>
  );
}
