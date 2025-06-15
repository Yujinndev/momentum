'use server'

import { getAuthUser } from '@/actions/account/get-auth-user'
import { createSavingsGoalService } from '@/services/savings/create-savings-goal'
import { SavingsGoal } from '@/types/saving'

type CreateSavingsGoalArgs = {
  values: SavingsGoal
}

export const createSavingsGoal = async ({ values }: CreateSavingsGoalArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    await createSavingsGoalService({ values, userId: user.id })

    return { success: { message: 'Successfully created savings goal' } }
  } catch (error) {
    return {
      error: { message: 'Failed to create savings goal.', details: error },
    }
  }
}
