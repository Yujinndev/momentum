'use server'

import { prisma } from '@/lib/prisma'
import { BudgetSetting } from '@/types/budget'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { getRecurringPeriodDate } from '@/utils/get-recurring-period-date'
import { normalizedBudgets } from '@/utils/budget-helpers'

type CreateBudgetArgs = {
  values: BudgetSetting
}

export const createBudget = async ({ values }: CreateBudgetArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const startDate = new Date()
    const endDate = getRecurringPeriodDate({
      startDate,
      period: values.recurringPeriod,
    })

    const normalizedItems = normalizedBudgets(values)
    const createdBudgets = normalizedItems.budgets.map(async (budget) => {
      const budgetCategories = Array.isArray(budget.categories)
        ? budget.categories.map((id) => ({ id }))
        : { id: budget.categories }

      const res = await prisma.budget.create({
        data: {
          ...budget,
          startDate,
          endDate,
          userId: user.id,
          recurringPeriod: values.recurringPeriod,
          trackBy: values.method === 'ThreeBucket' ? 'ALL' : 'CATEGORY',
          isRecurring: true,
          categories: {
            connect: budgetCategories,
          },
        },
      })

      return res
    })

    await Promise.all(createdBudgets)

    return { success: { message: 'Successfully created budgets' } }
  } catch (error) {
    return {
      error: { message: 'Failed to create budgets.', details: error },
    }
  }
}
