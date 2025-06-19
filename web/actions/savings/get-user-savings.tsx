'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { addMonths, lastDayOfMonth } from 'date-fns'

export const getUserSavings = async () => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const response = await prisma.savingsGoal.findMany({
      where: {
        userId: user.id,
      },
      include: {
        schedules: true,
        contributions: true,
      },
    })

    const lastDayNextMonth = lastDayOfMonth(addMonths(new Date(), 1))
    const latestSchedules = await prisma.savingSchedule.findMany({
      where: {
        userId: user.id,
        dueDate: { lte: lastDayNextMonth },
      },
      include: { goal: true },
    })

    const savings = response.map((saving) => ({
      ...saving,
      currentAmount: Number(saving.currentAmount),
      targetAmount: Number(saving.targetAmount),
      contributions: saving.contributions.map((contribution) => ({
        ...contribution,
        amount: Number(contribution.amount),
      })),
      schedules: saving.schedules.map((schedule) => ({
        ...schedule,
        amount: Number(schedule.amount),
      })),
    }))

    return {
      items: savings,
      schedules: latestSchedules,
      success: { message: 'User savings goals fetched successfully' },
    }
  } catch (error) {
    return {
      items: [],
      schedules: [],
      error: { message: 'Failed to fetch savings goals', details: error },
    }
  }
}
