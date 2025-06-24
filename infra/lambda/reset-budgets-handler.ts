import { PrismaClient } from '@prisma/client'
import { getRecurringPeriodDate } from '../utils/get-recurring-period-date'

const prisma = new PrismaClient()

export const handler = async () => {
  try {
    const currentDate = new Date()

    const response = await prisma.$transaction(async (tx) => {
      const budgets = await tx.budget.findMany({
        where: {
          AND: [
            {
              deletedAt: null,
              isRecurring: true,
              endDate: { lte: currentDate },
              NOT: { recurringPeriod: null },
            },
          ],
        },
      })

      await tx.budget.updateMany({
        where: { deletedAt: null },
        data: {
          deletedAt: currentDate,
        },
      })

      const newBudgets = budgets.map((budget) => {
        const endDate = getRecurringPeriodDate({
          startDate: currentDate,
          period: budget.recurringPeriod!,
        })

        return {
          name: budget.name,
          userId: budget.userId,
          totalAmount: budget.totalAmount,
          recurringPeriod: budget.recurringPeriod,
          isRecurring: budget.isRecurring,
          percentage: budget.percentage,
          startDate: currentDate,
          endDate,
        }
      })

      await tx.budget.createMany({
        data: newBudgets,
      })

      return newBudgets
    })

    console.log('All Recurring Budgets successfully reset:', response.length)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Budgets reset successfully',
        data: response,
      }),
    }
  } catch (error) {
    console.error('Recurring Budget reset failed:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Failed to reset budgets',
        error,
      }),
    }
  }
}
