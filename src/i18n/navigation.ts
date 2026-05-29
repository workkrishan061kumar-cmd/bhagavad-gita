import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Use these instead of next/link, next/navigation directly.
// They are locale-aware.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
