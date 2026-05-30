import { z } from 'zod';

export const moodOptions = [
  'reflective',
  'grateful',
  'anxious',
  'peaceful',
  'confused',
  'motivated',
  'grieving',
  'angry',
  'lost',
] as const;

export type Mood = (typeof moodOptions)[number];

const moodEnum = z.enum(moodOptions);

export const verseRefSchema = z.object({
  chapter: z.number().int().min(1).max(18),
  verse: z.number().int().min(1).max(78),
});

export const createJournalSchema = verseRefSchema.extend({
  content: z.string().trim().min(1, 'Write something first.').max(20_000),
  mood: moodEnum.optional().nullable(),
});

export const updateJournalSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().trim().min(1).max(20_000),
  mood: moodEnum.optional().nullable(),
});

export const deleteJournalSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateJournalInput = z.infer<typeof createJournalSchema>;
export type UpdateJournalInput = z.infer<typeof updateJournalSchema>;
export type DeleteJournalInput = z.infer<typeof deleteJournalSchema>;
