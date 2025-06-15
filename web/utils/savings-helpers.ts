import { RecurringSavingsGoal, SavingsGoal } from '@/types/saving'

export const isRecurringSavingsGoal = (
  savings: SavingsGoal
): savings is RecurringSavingsGoal => {
  return savings.method === 'Recurring'
}
