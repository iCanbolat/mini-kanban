import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3, {
    message: 'Must be at least 3 characters.',
  }),
  role: z.enum(['ADMIN', 'USER']),
  password: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createCardSchema = z.object({
  input: z.string().min(3, {
    message: 'Must be at least 3 characters.',
  }),
  id: z.string().optional(),
});
