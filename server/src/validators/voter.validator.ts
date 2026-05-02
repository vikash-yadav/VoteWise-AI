import { z } from 'zod';

export const voterProfileSchema = z.object({
  uid: z.string().min(1, "User ID is required"),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
});

export const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  userId: z.string().optional(),
  history: z.array(z.any()).optional(),
  userContext: z.object({
    name: z.string().optional(),
    state: z.string().optional(),
    constituency: z.string().optional(),
    language: z.enum(['en', 'hi']).default('en'),
  }).optional(),
});
