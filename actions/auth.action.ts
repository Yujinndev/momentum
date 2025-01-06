'use server'

import { signIn, signOut } from '@/auth'

export async function logout() {
  await signOut({ redirectTo: '/auth/signin' })
}

export async function signinWithGoogle() {
  await signIn('google', { redirectTo: '/dashboard' })
}
