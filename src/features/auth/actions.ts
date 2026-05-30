'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/server/auth';
import { logger } from '@/shared/lib/logger';
import type { Result } from '@/shared/lib/result';
import { emailSignInSchema } from './schemas';

function fieldString(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

export async function signInWithEmail(
  _prevState: Result<{ email: string }> | null,
  formData: FormData,
): Promise<Result<{ email: string }>> {
  const parsed = emailSignInSchema.safeParse({
    email: fieldString(formData.get('email')),
    callbackUrl: fieldString(formData.get('callbackUrl')),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'invalid_input' };
  }

  try {
    await signIn('resend', {
      email: parsed.data.email,
      redirectTo: parsed.data.callbackUrl ?? '/me',
      redirect: false,
    });
    return { ok: true, data: { email: parsed.data.email } };
  } catch (err) {
    if (err instanceof AuthError) {
      logger.warn({ type: err.type, email: parsed.data.email }, 'magic-link signIn failed');
      return { ok: false, error: 'send_failed' };
    }
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
      throw err;
    }
    logger.error({ err, email: parsed.data.email }, 'magic-link unexpected error');
    return { ok: false, error: 'server_error' };
  }
}
