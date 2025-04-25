'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserWallets = async () => {
  try {
    const email = await getAuthUser()

    const user = await prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        wallets: {
          where: {
            deletedAt: { equals: null },
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const wallets = user.wallets?.map((wallet) => ({
      ...wallet,
      balance: Number(wallet.balance),
    }))

    return {
      items: wallets,
      success: { message: 'User wallets fetched successfully' },
    }
  } catch (error) {
    console.log('Get user wallets error:', error)
    throw error
  }
}
