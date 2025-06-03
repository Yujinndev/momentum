import {
  BudgetSetting,
  CategoryBasedBudget,
  ThreeBucketBudget,
} from '@/types/budget'

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
