'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/features/auth';
import { logger } from '@/shared/lib/logger';
import type { Result } from '@/shared/lib/result';
import { journalRepository } from './repository';
import { createJournalSchema, deleteJournalSchema, updateJournalSchema } from './schemas';

export async function createJournalEntry(input: {
  chapter: number;
  verse: number;
  content: string;
  mood?: string | null;
}): Promise<Result<{ id: number }>> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: 'unauthorized' };

  const parsed = createJournalSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'invalid_input' };
  }

  const userId = session.user.id;
  try {
    const entry = await journalRepository.create({
      userId,
      chapter: parsed.data.chapter,
      verse: parsed.data.verse,
      content: parsed.data.content,
      mood: parsed.data.mood ?? null,
    });
    revalidatePath('/me');
    revalidatePath('/me/journal');
    return { ok: true, data: { id: entry.id } };
  } catch (err) {
    logger.error({ err, userId, input: parsed.data }, 'createJournalEntry failed');
    return { ok: false, error: 'server_error' };
  }
}

export async function updateJournalEntry(input: {
  id: number;
  content: string;
  mood?: string | null;
}): Promise<Result<{ saved: true }>> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: 'unauthorized' };

  const parsed = updateJournalSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'invalid_input' };
  }

  const userId = session.user.id;
  try {
    const result = await journalRepository.update({
      userId,
      id: parsed.data.id,
      content: parsed.data.content,
      mood: parsed.data.mood ?? null,
    });
    if (result.count === 0) return { ok: false, error: 'not_found' };
    revalidatePath('/me');
    revalidatePath('/me/journal');
    revalidatePath(`/me/journal/${parsed.data.id}`);
    return { ok: true, data: { saved: true } };
  } catch (err) {
    logger.error({ err, userId, input: parsed.data }, 'updateJournalEntry failed');
    return { ok: false, error: 'server_error' };
  }
}

export async function deleteJournalEntry(input: {
  id: number;
}): Promise<Result<{ deleted: true }>> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: 'unauthorized' };

  const parsed = deleteJournalSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const userId = session.user.id;
  try {
    const result = await journalRepository.remove({ userId, id: parsed.data.id });
    if (result.count === 0) return { ok: false, error: 'not_found' };
    revalidatePath('/me');
    revalidatePath('/me/journal');
    return { ok: true, data: { deleted: true } };
  } catch (err) {
    logger.error({ err, userId, input: parsed.data }, 'deleteJournalEntry failed');
    return { ok: false, error: 'server_error' };
  }
}
