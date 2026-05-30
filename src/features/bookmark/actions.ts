'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/features/auth';
import { logger } from '@/shared/lib/logger';
import type { Result } from '@/shared/lib/result';
import { bookmarkRepository } from './repository';
import { addBookmarkSchema, removeBookmarkSchema } from './schemas';

type ToggleResult = { bookmarked: boolean };

export async function toggleBookmark(input: {
  chapter: number;
  verse: number;
  note?: string;
}): Promise<Result<ToggleResult>> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: 'unauthorized' };

  const parsed = addBookmarkSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const userId = session.user.id;
  const { chapter, verse, note } = parsed.data;

  try {
    const existing = await bookmarkRepository.findByVerse({ userId, chapter, verse });
    if (existing) {
      await bookmarkRepository.removeByVerse({ userId, chapter, verse });
      revalidatePath('/me');
      revalidatePath('/me/bookmarks');
      revalidatePath(`/verse/${chapter}/${verse}`);
      return { ok: true, data: { bookmarked: false } };
    }
    await bookmarkRepository.create({ userId, chapter, verse, note });
    revalidatePath('/me');
    revalidatePath('/me/bookmarks');
    revalidatePath(`/verse/${chapter}/${verse}`);
    return { ok: true, data: { bookmarked: true } };
  } catch (err) {
    logger.error({ err, userId, chapter, verse }, 'toggleBookmark failed');
    return { ok: false, error: 'server_error' };
  }
}

export async function removeBookmark(input: {
  chapter: number;
  verse: number;
}): Promise<Result<{ removed: true }>> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: 'unauthorized' };

  const parsed = removeBookmarkSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const userId = session.user.id;
  try {
    await bookmarkRepository.removeByVerse({
      userId,
      chapter: parsed.data.chapter,
      verse: parsed.data.verse,
    });
    revalidatePath('/me');
    revalidatePath('/me/bookmarks');
    revalidatePath(`/verse/${parsed.data.chapter}/${parsed.data.verse}`);
    return { ok: true, data: { removed: true } };
  } catch (err) {
    logger.error({ err, userId, input: parsed.data }, 'removeBookmark failed');
    return { ok: false, error: 'server_error' };
  }
}
