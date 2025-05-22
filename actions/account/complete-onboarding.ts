'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from './get-auth-user'

type CompleteUserOnboardingArgs = {}

export const completeUserOnboarding = async () => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingCompleted: true },
    })

    return { success: { message: 'Onboarding Completed' } }
  } catch (error) {
    return {
      error: { message: 'Failed to complete onboarding.', details: error },
    }
  }
}
