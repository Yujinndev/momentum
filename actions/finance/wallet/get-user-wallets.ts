'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserWallets = async () => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const userWallets = await prisma.wallet.findMany({
      where: { AND: [{ userId: user.id }, { deletedAt: null }] },
    })

    const wallets = userWallets?.map((wallet) => ({
      ...wallet,
      balance: Number(wallet.balance),
    }))

    return {
      items: wallets,
      success: { message: 'User wallets fetched successfully' },
    }
  } catch (error) {
    return {
      items: [],
      error: { message: 'Failed to fetch wallets.', details: error },
    }
  }
}
