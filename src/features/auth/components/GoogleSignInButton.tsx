import { getTranslations } from 'next-intl/server';
import { signIn } from '@/server/auth';

export async function GoogleSignInButton({ callbackUrl }: { callbackUrl?: string }) {
  const t = await getTranslations('auth');

  return (
    <form
      action={async () => {
        'use server';
        await signIn('google', { redirectTo: callbackUrl ?? '/' });
      }}
    >
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-full border border-gold-500/40 text-text-primary hover:bg-gold-500/10 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <title>Google</title>
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.5c-.2 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.7 14.6 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.5l-8.6-.5z"
          />
        </svg>
        <span>{t('continueWithGoogle')}</span>
      </button>
    </form>
  );
}
