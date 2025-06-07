'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserBudgets = async () => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const response = await prisma.$transaction(async (tx) => {
      const userPreference = await tx.budgetPreference.findFirstOrThrow({
        where: { userId: user.id },
      })

      const currentDate = new Date()
      const userBudget = await tx.budget.findMany({
        where: {
          userId: user.id,
          endDate: { gte: currentDate },
          deletedAt: null,
        },
        include: { categories: { select: { id: true } } },
      })

      const budgets = userBudget
        .map((budget) => ({
          ...budget,
          spent: Number(budget.spent),
          totalAmount: Number(budget.totalAmount),
          categories: budget.categories.map(({ id }) => id),
        }))
        .slice()
        .sort((a, b) => b.totalAmount - a.totalAmount)

      const totalAmount = budgets.reduce(
        (acc, budget) => acc + budget.totalAmount,
        0
      )

      return {
        totalAmount,
        items: budgets,
        method: userPreference.method,
        budgetPreferenceId: userPreference.id,
      }
    })

    return {
      ...response,
      success: { message: 'User budgets fetched successfully' },
    }
  } catch (error) {
    return {
      items: [],
      error: { message: 'Failed to fetch budgets.', details: error },
    }
  }
}
