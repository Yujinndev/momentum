import { prisma } from '@/lib/prisma'
import { isThreeBucketBudget } from '@/utils/budget-helpers'
import { handleThreeBucketBudgets } from './handle-three-bucket-budgets'
import { HandleCategoryBasedBudgets } from './handle-category-based-budgets'
import { BudgetSetting } from '@/types/budget'

export type UpdateBudgetServiceArgs = {
  values: BudgetSetting
  userId: string
  budgetPrefId: number
  isRetainingProgress: boolean
}

export const updateBudgetService = async ({
  values,
  userId,
  budgetPrefId,
  isRetainingProgress,
}: UpdateBudgetServiceArgs) => {
  return await prisma.$transaction(async (tx) => {
    const startDate = new Date()
    const userPreference = await tx.budgetPreference.findFirstOrThrow({
      where: { userId },
    })

    if (values.method !== userPreference.method) {
      await tx.budgetPreference.update({
        data: { method: values.method, userId },
        where: { id: budgetPrefId },
      })

      await tx.budget.updateMany({
        where: { userId, deletedAt: null },
        data: {
          deletedAt: startDate,
        },
      })
    }

    const context = { prisma: tx, startDate, userId, isRetainingProgress }
    if (isThreeBucketBudget(values)) {
      await handleThreeBucketBudgets({ ...context, values })
    } else {
      await HandleCategoryBasedBudgets({ ...context, values })
    }
  })
}
