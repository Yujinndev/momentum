import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.onboardingCompleted = user.onboardingCompleted
        token.sub = user.id
      }

      if (trigger === 'update' && session?.onboardingCompleted) {
        token.onboardingCompleted = session.onboardingCompleted
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.onboardingCompleted = token.onboardingCompleted || false
      }
      return session
    },
  },
  events: {
    createUser: async ({ user }) => {
      await prisma.user.update({
        where: { id: user.id },
        data: { onboardingCompleted: false },
      })
    },
  },
  ...authConfig,
})
