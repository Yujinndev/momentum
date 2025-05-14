'use server'

import { prisma } from '@/lib/prisma'
import { Transaction } from '@/types/transaction'
import { calculateBalance } from '@/utils/calculate-balance'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { revalidatePath } from 'next/cache'

export type CreateTransactionArgs = {
  values: Transaction
}

export const createTransaction = async ({ values }: CreateTransactionArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const newTransaction = await prisma.$transaction(async (tx) => {
      const walletIDs = [values.walletId]

      if (values.type === 'TRANSFER') {
        walletIDs.push(values.receivingWalletId)
      }

      const wallets = await tx.wallet.findMany({
        where: {
          AND: [{ userId: user.id }, { id: { in: walletIDs } }],
        },
      })

      const transactingWallet = wallets.find(
        (wallet) => wallet.id === values.walletId
      )

      if (!transactingWallet) {
        throw new Error('Transacting Wallet not found or unauthorized access')
      }

      const { amount, type } = values
      const newBalance = calculateBalance({
        txType: type === 'INCOME' ? 'ADD' : 'DEDUCT',
        txAmount: amount,
        currentBalance: transactingWallet.balance,
      })

      const createdTransaction = await tx.transaction.create({
        data: {
          ...values,
          userId: user.id,
          walletRunningBalance: newBalance,
        },
      })

      await tx.wallet.update({
        where: { id: transactingWallet.id },
        data: {
          balance: newBalance,
        },
      })

      if (values.type === 'TRANSFER') {
        const receivingWallet = wallets.find(
          (wallet) => wallet.id === values.receivingWalletId
        )

        if (!receivingWallet) {
          throw new Error('Receiving Wallet not found or unauthorized access')
        }

        const updatedBalance = calculateBalance({
          txType: 'ADD',
          txAmount: amount,
          currentBalance: receivingWallet.balance,
        })

        await tx.transaction.create({
          data: {
            ...values,
            userId: user.id,
            walletRunningBalance: updatedBalance,
          },
        })

        await tx.wallet.update({
          where: { id: receivingWallet.id },
          data: {
            balance: updatedBalance,
          },
        })
      }

      return createdTransaction
    })

    revalidatePath('/transaction')

    const transaction = {
      ...newTransaction,
      amount: Number(newTransaction.amount),
      walletRunningBalance: Number(newTransaction.walletRunningBalance),
    }

    return {
      transaction,
      success: { message: 'Transaction created successfully' },
    }
  } catch (error) {
    console.log('Create transaction error:', error)
    throw error
  }
}
