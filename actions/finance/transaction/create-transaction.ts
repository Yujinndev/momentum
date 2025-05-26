'use server'

import { revalidatePath } from 'next/cache'
import { Transaction } from '@/types/transaction'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { createTransactionService } from '@/services/transaction/create-transaction'

export type CreateTransactionArgs = {
  values: Transaction
}

export const createTransaction = async ({ values }: CreateTransactionArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    await createTransactionService({
      values,
      userId: user.id,
    })

    revalidatePath('/finance/transaction/new')

    return {
      success: { message: 'Transaction created successfully' },
    }
  } catch (error) {
    return {
      error: { message: 'Failed to create transaction', details: error },
    }
  }
}
