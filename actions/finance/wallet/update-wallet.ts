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
  try {
    const email = await getAuthUser()

    const updatedWallet = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
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

      const userWallet = user.financialProfile.wallets[0]
      if (!userWallet) {
        throw new Error('Wallet not found or unauthorized access')
      }

      const wallet = await tx.wallet.update({
        where: { id: userWallet.id },
        data: values,
      })

      if (values.isDefault) {
        await tx.wallet.updateMany({
          where: {
            AND: [
              {
                NOT: [
                  {
                    id: wallet.id,
                  },
                ],
                isDefault: true,
              },
            ],
          },
          data: {
            isDefault: false,
          },
        })
      }

      return { ...wallet, balance: Number(wallet.balance) }
    })

    revalidatePath('/dashboard')

    return {
      wallet: updatedWallet,
      message: 'Wallet updated successfully',
    }
  } catch (error) {
    console.log('Wallet update error:', error)

    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: 'Failed to update wallet' }
  }
}
