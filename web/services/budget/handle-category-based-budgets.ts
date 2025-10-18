import { BaseArgs } from './base'
import { CategoryBasedBudget } from '@/types/budget'
import { extractTimeConfig } from '@/utils/date'

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
    const { id, category, timeConfig, ...rest } = budget

    const { isRecurring, endDate, recurringPeriod } = extractTimeConfig(
      budget.timeConfig,
      startDate
    )

    const data = {
      ...rest,
      userId,
      startDate,
      endDate,
      recurringPeriod,
      isRecurring,
      spent: isRetainingProgress ? (budget.spent ?? 0) : 0,
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
