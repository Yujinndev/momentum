'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserTransactions = async () => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const response = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { transactionDate: 'desc' },
    })

    const transactions = response.map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
      walletRunningBalance: Number(transaction.walletRunningBalance),
    }))

    return {
      items: transactions,
      success: { message: 'User transactions fetched successfully' },
    }
  } catch (error) {
    return {
      items: [],
      error: { message: 'Failed to fetch transactions', details: error },
    }
  }
}
