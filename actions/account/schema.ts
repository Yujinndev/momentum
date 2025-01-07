import { z } from 'zod'

export const financialProfileSchema = z.object({
  name: z.string().min(4, { message: 'Name is required.' }),
  description: z.string(),
  currency: z.string().min(1, { message: 'Current is required.' }),
})

export type FinancialProfile = z.infer<typeof financialProfileSchema>
