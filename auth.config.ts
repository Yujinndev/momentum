import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

export default {
  providers: [Google],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    authorized: async ({ request: { nextUrl }, auth }) => {
      const isLoggedIn = !!auth?.user

      if (nextUrl.pathname.startsWith('/auth/signin') && isLoggedIn) {
        const newUrl = new URL('/dashboard', nextUrl.origin)
        return Response.redirect(newUrl)
      }

      return !!auth
    },
  },
} satisfies NextAuthConfig
