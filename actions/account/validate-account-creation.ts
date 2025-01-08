'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export const validateAccountCreationStatus = async () => {
  const cookieStore = await cookies()
  const validated = cookieStore.get('account:state')

  if (validated) {
    return {
      success: 'User already finished account creation!',
    }
  }

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

    const profile = await prisma.financialProfile.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (profile) {
      cookieStore.set('account:state', 'validated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      })

      return {
        success: 'User already finished account creation!',
      }
    }
  } catch {
    return {
      error: 'Something went wrong!',
    }
  }

  redirect('/auth/account/completion')
}
