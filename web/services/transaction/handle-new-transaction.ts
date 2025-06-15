import { Transaction } from '@/types/transaction'
import { Prisma, PrismaClient } from '@prisma/client'
import { calculateBalance } from '@/utils/calculate-balance'
import { getWallet } from '@/actions/wallet/get-wallet'

type HandleNewTransactionArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: Transaction
  userId: string
  walletId: string
  includeWalletUpdate?: boolean
}

export const handleNewTransaction = async ({
  prisma,
  values,
  userId,
  walletId,
  includeWalletUpdate = true,
}: HandleNewTransactionArgs) => {
  const response = await getWallet({ tx: prisma, walletId })

  if (!response.wallet) {
    throw new Error(response.error.message)
  }

  const newBalance = calculateBalance({
    txType: values.type,
    txAmount: values.amount,
    currentBalance: response.wallet.balance,
    isSender: values.walletId === walletId,
  })

  const createdTransaction = await prisma.transaction.create({
    data: {
      ...values,
      userId,
      walletRunningBalance: newBalance,
    },
  })

  if (includeWalletUpdate) {
    await prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    })
  }

  return createdTransaction
}
