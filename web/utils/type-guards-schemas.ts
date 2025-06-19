import {
  BudgetSetting,
  CategoryBasedBudget,
  ThreeBucketBudget,
} from '@/types/budget'
import { RecurringSavingsGoal, SavingsGoal } from '@/types/saving'

export const isThreeBucketBudget = (
  budget: BudgetSetting
): budget is ThreeBucketBudget => {
  return budget.method === 'ThreeBucket'
}

export const isCategoryBasedBudget = (
  budget: BudgetSetting
): budget is CategoryBasedBudget => {
  return budget.method === 'CategoryBased'
}

export const isRecurringMethodSavingsGoal = (
  goal: SavingsGoal
): goal is RecurringSavingsGoal => {
  return goal.method === 'Recurring'
}
