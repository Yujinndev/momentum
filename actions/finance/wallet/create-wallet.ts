'use server'

import { prisma } from '@/lib/prisma'
import { Wallet } from '@/types/wallet'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { revalidatePath } from 'next/cache'

type CreateWalletArgs = {
  values: Wallet
}

export const createWallet = async ({ values }: CreateWalletArgs) => {
  try {
    const email = await getAuthUser()

    const createdWallet = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: { email },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const wallet = await tx.wallet.create({
        data: {
          ...values,
          userId: user.id,
        },
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
    })

    revalidatePath('/dashboard')

    return {
      wallet: createdWallet,
      message: 'Wallet created successfully',
    }
  } catch (error) {
    console.log('Create wallet error:', error)

    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: 'Failed to create wallet' }
  }
}
