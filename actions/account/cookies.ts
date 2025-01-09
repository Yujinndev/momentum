'use server'

import { cookies } from 'next/headers'

export async function setAccountValidatedCookie() {
  const cookieStore = await cookies()
  cookieStore.set('account:state', 'validated', {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
  })
}

export const getAccountValidatedCookie = async () => {
  const cookieStore = await cookies()
  return cookieStore.has('account:state')
}
