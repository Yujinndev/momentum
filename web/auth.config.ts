import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

export default {
  providers: [Google],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
} satisfies NextAuthConfig
