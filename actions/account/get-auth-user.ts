'use server'

import { auth } from '@/auth'

export const getAuthUser = async () => {
  const user = await auth()

  if (!user?.user) {
    throw new Error('User must be logged in')
  }

  if (!user.user.email) {
    throw new Error('User email not found')
  }

  return user.user.email
}
