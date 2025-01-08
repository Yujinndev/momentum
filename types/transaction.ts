import { z } from 'zod'

export const transactionSchema = z.object({
  id: z.string().nullable(),
  description: z.string().min(1, { message: 'Description is required.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  amount: z.coerce.number().positive().finite(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER', 'SAVINGS']),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']),
  walletId: z.string().min(1, { message: 'Wallet is required.' }),
  financialProfileId: z.string().min(1, { message: 'Profile is required.' }),
  budgetId: z.string().nullable(),
  savingsGoalId: z.string().nullable(),
  date: z.coerce.date(),
})

export type Transaction = z.infer<typeof transactionSchema>
export type TransactionWithID = Transaction & { id: number }

// description        String
// category           String
// amount             Decimal           @default(0) @db.Decimal(10, 2)
// type               TransactionType
// status             TransactionStatus @default(COMPLETED)
// walletId           String
// wallet             Wallet            @relation(fields: [walletId], references: [id], onDelete: Cascade)
// financialProfileId String
// financialProfile   FinancialProfile  @relation(fields: [financialProfileId], references: [id], onDelete: Cascade)
// budgetId           String?
// budget             Budget?           @relation(fields: [budgetId], references: [id])
// savingsGoalId      String?
// savingsGoal        SavingsGoal?      @relation(fields: [savingsGoalId], references: [id])
// date               DateTime          @default(now())
// updatedAt          DateTime          @updatedAt
