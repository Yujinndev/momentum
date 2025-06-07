'use server'

import { getAuthUser } from '@/actions/account/get-auth-user'
import { prisma } from '@/lib/prisma'

type DeleteWalletArgs = {
  id: string
}

export const deleteWallet = async ({ id }: DeleteWalletArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const wallet = await prisma.wallet.findFirstOrThrow({
      where: { id, userId: user.id },
    })

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { deletedAt: new Date() },
    })

    return {
      success: { message: 'User wallet deleted successfully' },
    }
  } catch (error) {
    return { error: { message: 'Failed to delete wallet', details: error } }
  }
}
