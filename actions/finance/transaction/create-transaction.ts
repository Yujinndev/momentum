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
  try {
    const email = await getAuthUser()

    const newTransaction = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: { email },
        include: {
          financialProfile: {
            include: {
              wallets: {
                where: { id: values.walletId },
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

      const { amount, type } = values
      const newBalance = calculateBalance({
        txType: type,
        txAmount: amount,
        currentBalance: userWallet.balance,
      })

      const createdTransaction = await tx.transaction.create({
        data: {
          ...values,
          walletRunningBalance: newBalance,
          financialProfileId: user.financialProfile.id,
        },
      })

      /* TODO: 
        CHECK txType IF TRANSFER TO ALSO UPDATE BALANCE OF OTHER WALLET
        CHECK txType IF TRANSFER TO ALSO UPDATE BALANCE OF OTHER WALLET
      */
      await tx.wallet.update({
        where: { id: userWallet.id },
        data: {
          balance: newBalance,
        },
      })

      await tx.financialProfile.update({
        where: { id: user.financialProfile.id },
        data: {
          [type === 'EXPENSE' ? 'totalExpenses' : 'totalIncome']: {
            increment: amount,
          },
        },
      })

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

    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: 'Failed to create transaction' }
  }
}
