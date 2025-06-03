import { z } from 'zod'

const threeBucketSchema = z.object({
  method: z.literal('ThreeBucket'),
  recurringPeriod: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY', 'NONE'])
    .nullable(),
  totalAmount: z.coerce
    .number()
    .positive({
      message: 'Amount is required.',
    })
    .finite(),
  buckets: z
    .array(
      z.object({
        id: z.string().optional(),
        categories: z
          .array(z.coerce.number({ message: 'Category is required.' }))
          .min(1, { message: 'Category is required.' }),
        name: z.string().min(1, { message: 'Name is required.' }),
        percentage: z.coerce
          .number()
          .positive({
            message: 'Percentage is required.',
          })
          .finite(),
        totalAmount: z.coerce
          .number()
          .nonnegative({
            message: 'Amount is required.',
          })
          .finite(),
        spent: z.coerce.number().nullable(),
      })
    )
    .min(3)
    .refine(
      (buckets) =>
        buckets.reduce((acc, curr) => acc + curr.percentage, 0) === 100,
      { message: 'Overall percentage must be equal to 100.' }
    ),
})
export type ThreeBucketBudget = z.infer<typeof threeBucketSchema>

const categoryBasedSchema = z.object({
  method: z.literal('CategoryBased'),
  budgets: z
    .array(
      z.object({
        id: z.string().optional(),
        categories: z.coerce
          .number({ message: 'Category is required.' })
          .positive()
          .finite(),
        name: z.string().min(1, { message: 'Name is required.' }),
        recurringPeriod: z
          .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY', 'NONE'])
          .nullable(),
        totalAmount: z.coerce
          .number()
          .positive({
            message: 'Amount is required.',
          })
          .finite(),
        spent: z.coerce.number().nullable(),
      })
    )
    .min(1, { message: 'Kindly add your budget' }),
})
export type CategoryBasedBudget = z.infer<typeof categoryBasedSchema>

export const budgetSettingSchema = z.discriminatedUnion('method', [
  threeBucketSchema,
  categoryBasedSchema,
])

export type BudgetSetting = z.infer<typeof budgetSettingSchema>

export type DetailedBudget = {
  id: string
  userId: string
  name: string
  spent: number
  totalAmount: number
  percentage: number | null
  createdAt: Date | null
  updatedAt: Date | null
  deletedAt: Date | null
  startDate: Date
  endDate: Date
  isRecurring: boolean
  recurringPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY' | 'NONE' | null
  categories?: number[]
}
