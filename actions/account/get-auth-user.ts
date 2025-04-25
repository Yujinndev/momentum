'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const getAuthUser = async () => {
  const user = await auth()

  if (!user?.user || !user.user.email) {
    redirect('/')
  }

  return user.user.email
}
