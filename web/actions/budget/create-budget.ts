'use server'

import { BudgetSetting } from '@/types/budget'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { createBudgetService } from '@/services/budget/create-budget'

type CreateBudgetArgs = {
  values: BudgetSetting
}

export const createBudget = async ({ values }: CreateBudgetArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    await createBudgetService({ values, userId: user.id })

    return { success: { message: 'Successfully created budgets' } }
  } catch (error) {
    return {
      error: { message: 'Failed to create budgets.', details: error },
    }
  }
}
