'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserTransactions = async () => {
  try {
    const email = await getAuthUser()

    const user = await prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        transactions: {
          orderBy: { transactionDate: 'desc' },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const transactions = user.transactions

    const allTransactions = transactions.map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
      walletRunningBalance: Number(transaction.walletRunningBalance),
    }))

    return {
      transactions: allTransactions,
      success: { message: 'User transactions fetched successfully' },
    }
  } catch (error) {
    console.log('Get user transactions error:', error)
    throw error
  }
}
