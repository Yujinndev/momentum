import { z } from 'zod'

export const transactionSchema = z.object({
  description: z.string().min(1, { message: 'Description is required.' }),
  amount: z.coerce
    .number()
    .positive({
      message: 'Amount must be greater than 0',
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
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']),
  walletId: z.string().min(1, { message: 'Wallet is required.' }),
  financialProfileId: z.string().min(1, { message: 'Profile is required.' }),
  budgetId: z.string().nullable(),
  savingsGoalId: z.string().nullable(),
  date: z.coerce.date(),
})

export type Transaction = z.infer<typeof transactionSchema>
