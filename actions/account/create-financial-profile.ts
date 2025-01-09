'use server'

import { prisma } from '@/lib/prisma'
import { FinancialProfile } from '@/types/profile'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { setAccountValidatedCookie } from './cookies'

type CreateFinancialProfileArgs = {
  values: FinancialProfile
}

export const createFinancialProfile = async ({
  values,
}: CreateFinancialProfileArgs) => {
  try {
    const email = await getAuthUser()

    const user = await prisma.user.findFirstOrThrow({
      where: { email },
    })

    if (!user) {
      throw new Error('No user found')
    }

    const createdProfile = await prisma.financialProfile.create({
      data: {
        userId: user.id,
        name: values.name,
        description: values.description,
        currency: values.currency,
      },
    })

    const userProfile = {
      ...createdProfile,
      totalIncome: Number(createdProfile.totalIncome),
      totalExpenses: Number(createdProfile.totalExpenses),
    }

    // NOTE: currently not working
    await setAccountValidatedCookie()

    return {
      profile: userProfile,
      message: 'Financial profile created successfully!',
    }
  } catch (error) {
    console.log('Create profile account error:', error)

    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: 'Failed to create profile account' }
  }
}
