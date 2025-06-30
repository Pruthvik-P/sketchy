import {z} from 'zod';

export const createUserSchema = z.object({
  email: z.string().email().min(5).max(100),
  password: z.string().min(4).max(20),
  name: z.string()
})

export const signInSchema = z.object({
  email: z.string().email().min(5).max(100),
  password: z.string().min(4).max(20)
})

export const createRoomSchema = z.object({
  name: z.string().min(3).max(20),
})