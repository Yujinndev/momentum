'use server'

import { getAuthUser } from '@/actions/account/get-auth-user'
import { prisma } from '@/lib/prisma'

type DeleteWalletArgs = {
  id: string
}

export const deleteWallet = async ({ id }: DeleteWalletArgs) => {
  try {
    const email = await getAuthUser()

    const user = await prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        financialProfile: {
          include: {
            wallets: {
              where: { id },
            },
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

    const userWallet = user.financialProfile?.wallets[0]
    if (!userWallet) {
      throw new Error('Wallet not found or unauthorized access')
    }

    await prisma.wallet.update({
      where: { id: userWallet.id },
      data: {
        deletedAt: new Date(),
      },
    })

    return {
      message: 'User wallet deleted successfully',
    }
  } catch (error) {
    console.log('Wallet deletion error:', error)

    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }

    return { error: 'Failed to delete wallet' }
  }
}
