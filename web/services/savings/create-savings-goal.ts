import { prisma } from '@/lib/prisma'
import { SavingsGoal } from '@/types/saving'
import { getRecurringPeriodDate } from '@/utils/get-recurring-period-date'
import { isRecurringSavingsGoal } from '@/utils/savings-helpers'

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

    if (isRecurringSavingsGoal(values)) {
      const startDate = new Date()
      const countOfSchedules = Number(values.timeFrame)
      const recurrenceAmount = values.targetAmount / countOfSchedules

      const savings = Array(countOfSchedules).map((_, index) => {
        const dueDate = getRecurringPeriodDate({
          startDate,
          period: values.recurringPeriod,
          multiplier: index + 1,
        })

        return {
          dueDate,
          goalId: goal.id,
          amount: recurrenceAmount,
          autoCredit: values.autoCredit,
        }
      })

      await tx.savingSchedule.createMany({
        data: savings,
      })
    }

    return goal
  })
}
