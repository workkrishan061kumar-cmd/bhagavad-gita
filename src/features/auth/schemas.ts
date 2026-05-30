import { z } from 'zod';

export const emailSignInSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  callbackUrl: z.string().min(1).optional(),
});

export type EmailSignInInput = z.infer<typeof emailSignInSchema>;
