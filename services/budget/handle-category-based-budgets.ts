import { BaseArgs } from './base'
import { CategoryBasedBudget } from '@/types/budget'
import { getRecurringPeriodDate } from '@/utils/get-recurring-period-date'

type HandleCategoryBasedBudgetsArgs = BaseArgs & {
  values: CategoryBasedBudget
}

export const HandleCategoryBasedBudgets = async ({
  prisma,
  values,
  startDate,
  userId,
  isRetainingProgress,
}: HandleCategoryBasedBudgetsArgs) => {
  const createdBudgets = values.budgets.map(async (budget) => {
    const endDate = getRecurringPeriodDate({
      startDate,
      period: budget.recurringPeriod ?? 'NONE',
    })

    const data = {
      ...budget,
      startDate,
      endDate,
      userId,
      spent: isRetainingProgress ? (budget.spent ?? 0) : 0,
      recurringPeriod:
        budget.recurringPeriod !== 'NONE' ? budget.recurringPeriod : null,
      isRecurring: budget.recurringPeriod !== 'NONE',
      categories: {
        connect: { id: budget.categories },
      },
    }

    const res = await prisma.budget.upsert({
      create: data,
      update: data,
      where: { id: budget.id, deletedAt: null },
    })

    return res
  })

  await Promise.all(createdBudgets)
}
