import { z } from 'zod'

export const walletSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().nullable(),
  color: z.enum(['BLACK', 'WHITE', 'GREEN', 'RED', 'ORANGE', 'BLUE', 'PURPLE']),
  balance: z.coerce.number().nonnegative().finite(),
  isDefault: z.boolean(),
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
})

export type Wallet = z.infer<typeof walletSchema>
export type WalletWithId = Wallet & { id: string }
