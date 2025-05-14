import { KeyboardEvent } from 'react'
import { z } from 'zod'

const numberSchema = z.object({
  number: z.coerce.number().positive().finite(),
})

export const validateNumber = (value: string) => {
  const valueToFloat = parseFloat(value)
  const res = numberSchema.safeParse({ number: valueToFloat })

  const regexValue = value.replace(/[^\d.]/g, '')
  if (!res.success) return regexValue

  return res.data.number.toString()
}

export const isValidNumberInput = (event: KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    '.',
  ]

  if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
    return false
  }

  return true
}
