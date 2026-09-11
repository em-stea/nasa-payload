import { z } from 'zod'

const envSchema = z.object({
  ENVIRONMENT: z.enum(['production', 'staging', 'local']),
})

const parsedEnv = envSchema.safeParse({
  ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
})

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format())
  throw new Error('Invalid environment variables. Check the console for details.')
}

export const BACK_ENV = parsedEnv.data
