'use server'

import { prisma } from '@/lib/prisma'
import { Wallet } from '@/types/wallet'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { revalidatePath } from 'next/cache'
import { handleNewTransaction } from '@/services/transaction/handle-new-transaction'
import { Transaction } from '@/types/transaction'

type UpdateWalletArgs = {
  id: string
  values: Partial<Wallet>
}

export const updateWallet = async ({ id, values }: UpdateWalletArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const updatedWallet = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findFirstOrThrow({
        where: { id, userId: user.id },
      })

      if (Number(values.balance) !== Number(wallet.balance)) {
        const difference = Number(values.balance) - Number(wallet.balance)

        const transactionValues = {
          walletId: wallet.id,
          description: 'Wallet Update',
          type: difference > 0 ? 'INCOME' : 'EXPENSE',
          amount: Math.abs(difference),
          categoryId: 1,
          transactionDate: new Date(),
        } satisfies Transaction

        await handleNewTransaction({
          prisma: tx,
          userId: user.id,
          walletId: wallet.id,
          values: transactionValues,
          includeWalletUpdate: false,
        })
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
    return { error: { message: 'Failed to update wallet', details: error } }
  }
}
