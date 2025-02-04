'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserTransactions = async () => {
  try {
    const email = await getAuthUser()

    const user = await prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        financialProfile: {
          include: {
            transactions: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.financialProfile) {
      throw new Error('Financial profile not found')
    }

    const transactions = user.financialProfile?.transactions
    if (!transactions) {
      return {
        transactions: [],
        currency: user.financialProfile?.currency,
      }
    }

    const allTransactions = transactions.map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
      walletRunningBalance: Number(transaction.walletRunningBalance),
    }))

    return {
      transactions: allTransactions,
      currency: user.financialProfile?.currency,
      success: { message: 'User transactions fetched successfully' },
    }
  } catch (error) {
    console.log('Get user transactions error:', error)

    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: 'Failed to get user transactions' }
  }
}
