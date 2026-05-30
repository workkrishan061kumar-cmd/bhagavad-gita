import { z } from 'zod';

export const recordViewSchema = z.object({
  chapter: z.number().int().min(1).max(18),
  verse: z.number().int().min(1).max(78),
});

export type RecordViewInput = z.infer<typeof recordViewSchema>;
