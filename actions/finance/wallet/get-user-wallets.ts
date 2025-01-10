'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserWallets = async () => {
  try {
    const email = await getAuthUser()

    const user = await prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        financialProfile: {
          include: {
            wallets: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.financialProfile) {
      throw new Error('Financial profile not found')
    }

    const wallets = user.financialProfile.wallets?.map((wallet) => ({
      ...wallet,
      balance: Number(wallet.balance),
    }))

    return {
      items: wallets,
      currency: user.financialProfile.currency,
      financialProfileId: user.financialProfile.id,
      message: 'User wallets fetched successfully',
    }
  } catch (error) {
    console.log('Get user wallets error:', error)

    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: 'Failed to get user wallets' }
  }
}
