import { z } from 'zod'

export const walletSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string(),
  color: z.enum(['BLACK', 'WHITE', 'GREEN', 'RED', 'ORANGE', 'BLUE', 'PURPLE']),
  balance: z.coerce.number().positive().finite(),
  type: z.enum([
    'GENERAL',
    'CASH',
    'BANK',
    'E_WALLET',
    'CREDIT_CARD',
    'SAVINGS_ACCOUNT',
    'INSURANCE',
    'INVESTMENT',
  ]),
  isDefault: z.boolean(),
})

export type Wallet = z.infer<typeof walletSchema>
