import type { ReactNode } from 'react';
import { getSession } from '@/features/auth';
import { redirect } from '@/i18n/navigation';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MeLayout({ children, params }: Props) {
  const [session, { locale }] = await Promise.all([getSession(), params]);
  if (!session?.user) {
    redirect({
      href: { pathname: '/auth', query: { callbackUrl: '/me' } },
      locale,
    });
  }
  return <>{children}</>;
}
