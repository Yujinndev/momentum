import { z } from 'zod'

const baseGoalSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().optional(),
  targetAmount: z.coerce
    .number({
      required_error: 'Target amount is required.',
      invalid_type_error: 'Target amount is required.',
    })
    .positive()
    .finite(),
  endDate: z.coerce.date().optional(),
})

export type BaseSavingsGoal = z.infer<typeof baseGoalSchema>

const recurringSchema = baseGoalSchema.extend({
  method: z.literal('Recurring'),
  autoCredit: z.boolean(),
  amount: z.coerce
    .number({
      required_error: 'Amount is required.',
      invalid_type_error: 'Amount is required.',
    })
    .positive()
    .finite(),
  timeFrame: z.coerce
    .number({
      required_error: 'TimeFrame is required.',
      invalid_type_error: 'TimeFrame is required.',
    })
    .positive()
    .finite(),
  recurringPeriod: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY']),
})

export type RecurringSavingsGoal = z.infer<typeof recurringSchema>

export const savingsGoalSchema = z.discriminatedUnion('method', [
  baseGoalSchema.extend({ method: z.literal('Flexible') }),
  recurringSchema,
])

export type SavingsGoal = z.infer<typeof savingsGoalSchema>

export type Contributions = {
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  amount: number
  goalId: string
}

export type Schedules = {
  id: number
  status: 'PENDING' | 'COMPLETED' | 'AUTO_COMPLETED' | 'SKIPPED'
  autoCredit: boolean
  amount: number
  goalId: string
  dueDate: Date
  creditingDate: Date | null
  completedAt: Date | null
}

export type DetailedSavings = {
  id: string
  name: string
  description: string | null
  method: 'Flexible' | 'Recurring'
  currentAmount: number
  targetAmount: number
  endDate: Date | null
  walletId: string | null
  schedules?: Schedules[]
  contributions?: Contributions[]
}
