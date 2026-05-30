import { z } from 'zod';

export const verseRefSchema = z.object({
  chapter: z.number().int().min(1).max(18),
  verse: z.number().int().min(1).max(78),
});

export const addBookmarkSchema = verseRefSchema.extend({
  note: z.string().trim().max(500).optional(),
});

export const removeBookmarkSchema = verseRefSchema;

export type VerseRef = z.infer<typeof verseRefSchema>;
export type AddBookmarkInput = z.infer<typeof addBookmarkSchema>;
export type RemoveBookmarkInput = z.infer<typeof removeBookmarkSchema>;
