import { z } from 'zod'

const passwordValidation = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter'
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: passwordValidation,
  fullName: z.string().optional()
})

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
})

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
})

export const updatePasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const resetPasswordSchema = forgotPasswordSchema
