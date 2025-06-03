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
    const { id, category, ...rest } = budget

    const endDate = getRecurringPeriodDate({
      startDate,
      period: budget.recurringPeriod ?? 'NONE',
    })

    const data = {
      ...rest,
      startDate,
      endDate,
      userId,
      spent: isRetainingProgress ? (budget.spent ?? 0) : 0,
      recurringPeriod:
        budget.recurringPeriod !== 'NONE' ? budget.recurringPeriod : null,
      isRecurring: budget.recurringPeriod !== 'NONE',
      categories: {
        connect: { id: category },
      },
    }

    if (id) {
      return await prisma.budget.update({
        where: { id },
        data,
      })
    } else {
      return await prisma.budget.create({ data })
    }
  })

  await Promise.all(createdBudgets)
}
