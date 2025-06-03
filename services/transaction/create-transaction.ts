import { prisma } from '@/lib/prisma'
import { Transaction } from '@/types/transaction'
import { handleNewTransaction } from './handle-new-transaction'
import { handleUpdateBudgetSpending } from './handle-update-budget-spending'

type CreateTransactionServiceArgs = {
  values: Transaction
  userId: string
}

export const createTransactionService = async ({
  values,
  userId,
}: CreateTransactionServiceArgs) => {
  return await prisma.$transaction(async (tx) => {
    const createdTransaction = handleNewTransaction({
      prisma: tx,
      userId,
      values,
      walletId: values.walletId,
    })

    const context = { prisma: tx, values, userId }
    switch (values.type) {
      case 'EXPENSE':
        await handleUpdateBudgetSpending(context)
        break

      case 'TRANSFER':
        const walletId = values.receivingWalletId
        await handleNewTransaction({ ...context, walletId })
        break

      case 'INCOME':
        break
      case 'SAVINGS':
        break
      default:
        break
    }

    return createdTransaction
  })
}
