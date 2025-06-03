import { BaseArgs } from './base'
import { ThreeBucketBudget } from '@/types/budget'
import { getRecurringPeriodDate } from '@/utils/get-recurring-period-date'

type HandleThreeBucketBudgetsArgs = BaseArgs & {
  values: ThreeBucketBudget
}

export const handleThreeBucketBudgets = async ({
  prisma,
  values,
  startDate,
  userId,
  isRetainingProgress,
}: HandleThreeBucketBudgetsArgs) => {
  const endDate = getRecurringPeriodDate({
    startDate,
    period: values.recurringPeriod ?? 'NONE',
  })

  const createdBuckets = values.buckets.map(async (bucket) => {
    const data = {
      ...bucket,
      startDate,
      endDate,
      userId,
      spent: isRetainingProgress ? (bucket.spent ?? 0) : 0,
      recurringPeriod:
        values.recurringPeriod !== 'NONE' ? values.recurringPeriod : null,
      isRecurring: values.recurringPeriod !== 'NONE',
      categories: {
        connect: bucket.categories.map((id) => ({ id })),
      },
    }

    const res = await prisma.budget.upsert({
      create: data,
      update: data,
      where: { id: bucket.id, deletedAt: null },
    })

    return res
  })

  await Promise.all(createdBuckets)
}
