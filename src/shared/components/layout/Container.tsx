import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
};

export function Container({ children, className, size = 'lg' }: Props) {
  return <div className={cn('mx-auto w-full px-6', sizes[size], className)}>{children}</div>;
}
