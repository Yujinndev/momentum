'use server'

import { auth } from '@/auth'

export const getAuthUser = async () => {
  const user = await auth()

  if (!user?.user) {
    throw new Error('User must be logged in')
  }

  return user.user.email!
}
