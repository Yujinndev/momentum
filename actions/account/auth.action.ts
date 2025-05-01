'use server'

import { signIn, signOut } from '@/auth'

export const signinWithGoogle = async () => {
  await signIn('google', { redirectTo: '/dashboard' })
}

export const logout = async () => {
  await signOut({ redirectTo: '/auth/signin' })
}
