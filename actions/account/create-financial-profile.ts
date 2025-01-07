'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { FinancialProfile } from './schema'

export const createFinancialProfile = async (data: FinancialProfile) => {
  const user = await auth()

  if (!user?.user) {
    return {
      error: 'You must be logged in',
    }
  }

  const { email } = user.user

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { email },
    })

    if (!user) {
      return {
        error: 'No user found!',
      }
    }

    const createdProfile = await prisma.financialProfile.create({
      data: {
        userId: user.id,
        name: data.name,
        description: data.description,
        currency: data.currency,
      },
    })

    const serializedProfile = {
      ...createdProfile,
      netWorth: Number(createdProfile.netWorth),
      totalIncome: Number(createdProfile.totalIncome),
      totalExpenses: Number(createdProfile.totalExpenses),
    }

    return {
      success: 'Financial Profile Created Successfully!',
      profile: serializedProfile,
    }
  } catch {
    return {
      error: 'Something went wrong!',
    }
  }
}
