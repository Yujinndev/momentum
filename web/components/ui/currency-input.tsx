'use client'

import type { JSX } from 'react'
import { CURRENCIES } from '@/constants/choices'
import { isValidNumberInput, validateNumber } from '@/utils/validate-number'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type CurrencyInputProps = JSX.IntrinsicElements['input'] & {
  showIcon?: boolean
}

export const CurrencyInput = ({
  ref,
  onChange,
  showIcon = true,
  ...props
}: CurrencyInputProps) => {
  const PHCurrency = CURRENCIES[0]

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {showIcon && (
        <div className="border-e-none flex h-9 items-center justify-center rounded-md rounded-e-none border bg-muted-foreground/10 px-4">
          <PHCurrency.icon size={16} />
        </div>
      )}

      <Input
        {...props}
        ref={ref}
        type="number"
        inputMode="decimal"
        className={cn('focus-visible:outline-none focus-visible:ring-0', {
          'rounded-s-none border-l-0': showIcon,
        })}
        onKeyDown={(event) => {
          if (!isValidNumberInput(event)) {
            event.preventDefault()
          }
        }}
        onChange={(e) => {
          const rawValue = e.target.value
          const validatedValue = validateNumber(rawValue) as any
          onChange?.(validatedValue)
        }}
      />
    </div>
  )
}
