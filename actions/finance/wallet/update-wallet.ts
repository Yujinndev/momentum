'use server'

import { prisma } from '@/lib/prisma'
import { Wallet } from '@/types/wallet'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { revalidatePath } from 'next/cache'

type UpdateWalletArgs = {
  id: string
  values: Partial<Wallet>
}

export async function updateWallet({ id, values }: UpdateWalletArgs) {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const updatedWallet = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findFirstOrThrow({
        where: {
          AND: [{ userId: user.id }, { id: id }],
        },
      })

      if (!wallet) {
        throw new Error('Wallet not found or unauthorized access')
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: values,
      })

      if (values.isDefault) {
        await tx.wallet.updateMany({
          where: {
            AND: [{ NOT: { id: updatedWallet.id } }, { isDefault: true }],
          },
          data: { isDefault: false },
        })
      }

      return { ...updatedWallet, balance: Number(updatedWallet.balance) }
    })

    revalidatePath('/dashboard')

    return {
      wallet: updatedWallet,
      success: { message: 'Wallet updated successfully' },
    }
  } catch (error) {
    return { error: 'Failed to update wallet', details: error }
  }
}
