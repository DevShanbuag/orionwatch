import { z } from 'zod';

export const authEventIdSchema = z.string().min(1, 'Auth event ID is required');

export type AuthEventIdInput = z.infer<typeof authEventIdSchema>;

// Login validation schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export type LoginInput = z.infer<typeof loginSchema>;

