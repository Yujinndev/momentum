'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserBudgets = async () => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const response = await prisma.budget.findMany({
      where: { userId: user.id },
      include: { categories: true },
    })

    const budgets = response.map((budget) => ({
      ...budget,
      spent: Number(budget.spent),
      totalAmount: Number(budget.totalAmount),
    }))

    return {
      items: budgets,
      success: { message: 'User budgets fetched successfully' },
    }
  } catch (error) {
    return {
      items: [],
      error: { message: 'Failed to fetch budgets.', details: error },
    }
  }
}
