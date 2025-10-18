import {
  BudgetSetting,
  CategoryBasedBudget,
  ThreeBucketBudget,
  TimeConfig,
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

export const isRecurringTimeConfig = (
  timeConfig: TimeConfig
): timeConfig is Extract<TimeConfig, { isRecurring: true }> => {
  return timeConfig.isRecurring
}

export const isRecurringMethodSavingsGoal = (
  goal: SavingsGoal
): goal is RecurringSavingsGoal => {
  return goal.method === 'Recurring'
}
