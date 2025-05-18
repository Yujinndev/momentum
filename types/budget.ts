import { z } from 'zod'

export const baseBudgetSchema = z.object({
  method: z.enum(['ThreeBucket', 'CategoryBased']),
  recurringPeriod: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY']),
})

export type BaseBudget = z.infer<typeof baseBudgetSchema>

export const threeBucketSchema = baseBudgetSchema.extend({
  method: z.literal('ThreeBucket'),
  totalAmount: z.coerce
    .number()
    .positive({
      message: 'Amount is required.',
    })
    .finite(),
  buckets: z
    .array(
      z.object({
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

export const categoryBasedSchema = baseBudgetSchema.extend({
  method: z.literal('CategoryBased'),
  budgets: z
    .array(
      z.object({
        categories: z.coerce
          .number({ message: 'Category is required.' })
          .min(1, { message: 'Category is required.' }),
        name: z.string().min(1, { message: 'Name is required.' }),
        percentage: z.coerce.number().nonnegative().finite().default(0),
        totalAmount: z.coerce
          .number()
          .positive({
            message: 'Amount is required.',
          })
          .finite(),
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
