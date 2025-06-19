import { addDays } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { getRecurringPeriodDate } from '@/utils/get-recurring-period-date'
import { isRecurringMethodSavingsGoal } from '@/utils/type-guards-schemas'
import { SavingsGoal } from '@/types/saving'

type CreateSavingsGoalServicelArgs = {
  values: SavingsGoal
  userId: string
}

export const createSavingsGoalService = async ({
  values,
  userId,
}: CreateSavingsGoalServicelArgs) => {
  return await prisma.$transaction(async (tx) => {
    const goal = await tx.savingsGoal.create({
      data: {
        userId,
        name: values.name,
        description: values.description,
        targetAmount: values.targetAmount,
        method: values.method,
      },
    })

    if (isRecurringMethodSavingsGoal(values)) {
      const startDate = new Date()
      const countOfSchedules = Number(values.timeFrame)
      const recurrenceAmount = values.targetAmount / countOfSchedules

      const savings = Array.from({ length: countOfSchedules }).map(
        (_, index) => {
          const dueDate = getRecurringPeriodDate({
            startDate,
            period: values.recurringPeriod,
            multiplier: index + 1,
          })

          return {
            userId,
            dueDate,
            goalId: goal.id,
            amount: recurrenceAmount,
            autoCredit: values.autoCredit,
            creditingDate: addDays(dueDate, 1),
          }
        }
      )

      await tx.savingSchedule.createMany({
        data: savings,
      })
    }

    return goal
  })
}
