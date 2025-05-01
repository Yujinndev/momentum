'use server'

import { prisma } from '@/lib/prisma'
import { Wallet } from '@/types/wallet'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { revalidatePath } from 'next/cache'

type CreateWalletArgs = {
  values: Wallet
}

export const createWallet = async ({ values }: CreateWalletArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const createdWallet = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.create({
        data: {
          ...values,
          userId: user.id,
        },
      })

      if (values.isDefault) {
        await tx.wallet.updateMany({
          where: {
            AND: [{ NOT: { id: wallet.id } }, { isDefault: true }],
          },
          data: { isDefault: false },
        })
      }
    })

    revalidatePath('/dashboard')

    return {
      wallet: createdWallet,
      success: { message: 'Wallet created successfully' },
    }
  } catch (error) {
    return { error: 'Failed to create wallet', details: error }
  }
}
