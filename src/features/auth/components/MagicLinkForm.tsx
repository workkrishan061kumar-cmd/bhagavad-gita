'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Link, useRouter } from '@/i18n/navigation';
import type { Result } from '@/shared/lib/result';
import { signInWithEmail } from '../actions';

type State = Result<{ email: string }> | null;

const initialState: State = null;

function errorMessage(error: string, t: (key: string) => string): string {
  switch (error) {
    case 'send_failed':
      return t('errorSendFailed');
    case 'invalid_input':
      return t('errorInvalidEmail');
    default:
      return t('errorGeneric');
  }
}

function SubmitButton() {
  const t = useTranslations('auth');
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-5 py-3 rounded-full bg-gold-500 text-bg-base font-medium hover:bg-gold-300 transition-colors disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? t('sending') : t('sendMagicLink')}
    </button>
  );
}

export function MagicLinkForm({ callbackUrl }: { callbackUrl?: string }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [state, formAction] = useActionState<State, FormData>(signInWithEmail, initialState);

  useEffect(() => {
    if (state?.ok) {
      const encoded = encodeURIComponent(state.data.email);
      router.replace(`/auth/verify?email=${encoded}`);
    }
  }, [state, router]);

  return (
    <>
      <form action={formAction} className="space-y-3" noValidate>
        {callbackUrl ? <input type="hidden" name="callbackUrl" value={callbackUrl} /> : null}
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          className="w-full bg-bg-surface border border-gold-500/20 focus:border-gold-500 outline-none rounded-full px-5 py-3 text-text-primary placeholder:text-text-muted/60 transition-colors"
        />
        {state && !state.ok ? (
          <p className="text-saffron-400 text-xs px-2" role="alert">
            {errorMessage(state.error, t)}
          </p>
        ) : null}
        <SubmitButton />
      </form>

      <p className="text-text-muted/60 text-xs text-center mt-8 leading-relaxed">
        {t('termsLine')}{' '}
        <Link href="/legal/terms" className="text-gold-500 hover:text-gold-300">
          {t('terms')}
        </Link>{' '}
        {t('and')}{' '}
        <Link href="/legal/privacy" className="text-gold-500 hover:text-gold-300">
          {t('privacy')}
        </Link>
        .
      </p>
    </>
  );
}
