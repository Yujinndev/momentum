'use server'

import { signIn, signOut } from '@/auth'
import { cookies } from 'next/headers'

export const logout = async () => {
  await signOut({ redirectTo: '/auth/signin' })
}

export const signinWithGoogle = async () => {
  await signIn('google', { redirectTo: '/dashboard' })

  const cookieStore = await cookies()
  cookieStore.delete('account:state')
}
