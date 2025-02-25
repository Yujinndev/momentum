'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserFinancialProfile = async () => {
  try {
    const email = await getAuthUser()

    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        financialProfile: {
          include: {
            categories: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.financialProfile) {
      throw new Error('Financial profile not found')
    }

    const userProfile = {
      ...user.financialProfile,
      totalIncome: Number(user.financialProfile.totalIncome),
      totalExpenses: Number(user.financialProfile.totalExpenses),
    }

    return {
      profile: userProfile,
      success: { message: 'User profile fetched successfully!' },
    }
  } catch (error) {
    console.log('Get user financial profile error:', error)
    throw error
  }
}
