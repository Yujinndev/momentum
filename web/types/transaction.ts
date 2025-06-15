import { z } from 'zod'

export const baseTransactionSchema = z.object({
  description: z.string().min(1, { message: 'Description is required.' }),
  amount: z.coerce
    .number()
    .positive({
      message: 'Amount is required.',
    })
    .finite(),
  categoryId: z.coerce
    .number({
      required_error: 'Category is required.',
      invalid_type_error: 'Category is required.',
    })
    .positive()
    .finite(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER', 'SAVINGS']),
  walletId: z.string().min(1, { message: 'Wallet is required.' }),
  transactionDate: z.coerce.date(),
  budgetId: z.string().optional().nullable(),
})

export const transactionSchema = z.discriminatedUnion('type', [
  baseTransactionSchema.extend({
    type: z.literal('INCOME'),
  }),
  baseTransactionSchema.extend({
    type: z.literal('EXPENSE'),
  }),
  baseTransactionSchema.extend({
    type: z.literal('TRANSFER'),
    receivingWalletId: z.string().min(1, { message: 'Wallet is required.' }),
  }),
  baseTransactionSchema.extend({
    type: z.literal('SAVINGS'),
    savingsGoalId: z.string().min(1, { message: 'Savings Goal is required.' }),
  }),
])

export type BaseTransaction = z.infer<typeof baseTransactionSchema>
export type Transaction = z.infer<typeof transactionSchema>

export type DetailedTransaction = BaseTransaction & {
  id: string
  walletRunningBalance: number
}
