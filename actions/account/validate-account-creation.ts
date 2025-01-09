'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { getAccountValidatedCookie, setAccountValidatedCookie } from './cookies'

export const validateAccountCreationStatus = async () => {
  const validated = await getAccountValidatedCookie()

  if (validated) {
    return {
      success: 'User already finished account creation!',
    }
  }

  try {
    const email = await getAuthUser()
    const user = await prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        financialProfile: true,
      },
    })

    if (!user) {
      throw new Error('No user found')
    }

    if (user.financialProfile) {
      // NOTE: currently not working
      await setAccountValidatedCookie()

      return {
        message: 'User already finished account creation!',
      }
    }
  } catch (error) {
    console.log('Validate account creation error:', error)

    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: 'Failed to validate account creation' }
  }

  redirect('/auth/account/completion')
}
