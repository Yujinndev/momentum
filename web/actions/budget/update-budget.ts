'use server'

import { getAuthUser } from '@/actions/account/get-auth-user'
import {
  updateBudgetService,
  UpdateBudgetServiceArgs,
} from '@/services/budget/update-budget'

export const updateBudget = async ({
  values,
  budgetPrefId,
  isRetainingProgress,
}: Omit<UpdateBudgetServiceArgs, 'userId'>) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    await updateBudgetService({
      values,
      userId: user.id,
      budgetPrefId,
      isRetainingProgress,
    })

    return { success: { message: 'Successfully updated budgets' } }
  } catch (error) {
    return {
      error: { message: 'Failed to update budgets.', details: error },
    }
  }
}
