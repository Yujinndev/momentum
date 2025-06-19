import { prisma } from '@/lib/prisma'
import { isThreeBucketBudget } from '@/utils/type-guards-schemas'
import { handleThreeBucketBudgets } from './handle-three-bucket-budgets'
import { HandleCategoryBasedBudgets } from './handle-category-based-budgets'
import { BudgetSetting } from '@/types/budget'

type CreateBudgetServiceArgs = {
  values: BudgetSetting
  userId: string
}

export const createBudgetService = async ({
  values,
  userId,
}: CreateBudgetServiceArgs) => {
  return await prisma.$transaction(async (tx) => {
    const startDate = new Date()

    await tx.budgetPreference.create({
      data: { method: values.method, userId },
    })

    const context = { prisma: tx, startDate, userId }
    if (isThreeBucketBudget(values)) {
      await handleThreeBucketBudgets({ ...context, values })
    } else {
      await HandleCategoryBasedBudgets({ ...context, values })
    }
  })
}
