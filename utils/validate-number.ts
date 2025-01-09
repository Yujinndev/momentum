import { z } from 'zod'

const numberSchema = z.object({
  number: z.coerce.number().positive().finite(),
})

export const validateNumber = (value: string) => {
  if (!value) return 0

  const valueToFloat = parseFloat(value)
  const res = numberSchema.safeParse({ number: valueToFloat })

  if (!res.success) return 0

  return res.data.number
}
