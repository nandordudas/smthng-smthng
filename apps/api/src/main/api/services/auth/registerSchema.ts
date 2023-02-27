import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: '_email_',
    }).email(),
    password: z.string({
      required_error: '_password_',
    }),
    name: z.string({
      required_error: '_name_',
    }).trim(),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: '_email_',
    }).email(),
    password: z.string({
      required_error: '_password_',
    }),
  }),
})

export const refreshTokenSchema = z.object({
  body: z.object({
    refresh_token: z.string({
      required_error: '_refresh_token_',
    }),
  }),
})
