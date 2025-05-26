import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { Transaction } from '@/types/transaction'
import { calculateBalance } from '@/utils/calculate-balance'
import { getWallet } from '@/actions/finance/wallet/get-wallet'

type CreateTransactionServiceArgs<TValues = Transaction> = {
  tx: Prisma.TransactionClient
  values: TValues
  userId: string
}

export const createTransactionService = async ({
  values,
  userId,
}: Omit<CreateTransactionServiceArgs, 'tx'>) => {
  return await prisma.$transaction(async (tx) => {
    const createdTransaction = handleNewTransaction({
      tx,
      userId,
      values,
      walletId: values.walletId,
    })

    const context = { tx, values, userId }
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

const handleNewTransaction = async ({
  tx,
  values,
  userId,
  walletId,
}: CreateTransactionServiceArgs & { walletId: string }) => {
  const wallet = await getWallet({ tx, userId, walletId })
  const newBalance = calculateBalance({
    txType: values.type,
    txAmount: values.amount,
    currentBalance: wallet.balance,
    isSender: values.walletId === walletId,
  })

  const createdTransaction = await tx.transaction.create({
    data: {
      ...values,
      userId,
      walletRunningBalance: newBalance,
    },
  })

  await tx.wallet.update({
    where: { id: walletId },
    data: { balance: newBalance },
  })

  return createdTransaction
}

const handleUpdateBudgetSpending = async ({
  tx,
  userId,
  values: { categoryId, amount },
}: CreateTransactionServiceArgs) => {
  const budgets = await tx.budget.findMany({
    where: {
      userId,
      categories: { some: { id: categoryId } },
    },
  })

  const updates = budgets.map((budget) => {
    return tx.budget.update({
      where: { id: budget.id },
      data: { spent: Number(budget.spent) + amount },
    })
  })

  await Promise.all(updates)
}
