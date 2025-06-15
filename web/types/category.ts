import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  color: z.enum(['BLACK', 'WHITE', 'GREEN', 'RED', 'ORANGE', 'BLUE', 'PURPLE']),
})

export type Category = z.infer<typeof categorySchema>
