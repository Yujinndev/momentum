import { BaseArgs } from './base'
import { ThreeBucketBudget } from '@/types/budget'
import { extractTimeConfig } from '@/utils/date'

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
  const { isRecurring, endDate, recurringPeriod } = extractTimeConfig(
    values.timeConfig,
    startDate
  )

  const createdBuckets = values.buckets.map(async (bucket) => {
    const { id, ...rest } = bucket

    const data = {
      ...rest,
      startDate,
      endDate,
      userId,
      recurringPeriod,
      isRecurring,
      spent: isRetainingProgress ? (bucket.spent ?? 0) : 0,
      categories: {
        connect: bucket.categories.map((id) => ({ id })),
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

  await Promise.all(createdBuckets)
}
