'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const getAuthUser = async () => {
  try {
    const session = await auth()
    if (!session || !session.user?.email) throw new Error('User must logged in')

    const user = await prisma.user.findFirstOrThrow({
      where: { email: session.user.email },
    })

    return { user }
  } catch (error) {
    return {
      error: { message: 'Failed to get auth user.', details: error },
    }
  }
}
