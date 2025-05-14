'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserTransactions = async () => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { transactionDate: 'desc' },
    })

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
