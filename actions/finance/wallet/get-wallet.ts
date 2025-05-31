'use server'

import { getAuthUser } from '@/actions/account/get-auth-user'
import { prisma } from '@/lib/prisma'
import { Prisma, PrismaClient } from '@prisma/client'

type GetWalletArgs = {
  tx?: PrismaClient | Prisma.TransactionClient
  walletId: string
}

export const getWallet = async ({ tx = prisma, walletId }: GetWalletArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const response = await tx.wallet.findFirstOrThrow({
      where: { userId: user.id, id: walletId },
      include: { transactions: true },
    })

    const wallet = {
      ...response,
      balance: Number(response.balance),
      transactions: response.transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
        walletRunningBalance: Number(transaction.walletRunningBalance),
      })),
    }

    return {
      wallet,
      success: { message: 'Wallet fetched successfully' },
    }
  } catch (error) {
    return { error: 'Failed to fetch wallet', details: error }
  }
}
