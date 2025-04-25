'use client'

import type { JSX } from 'react'
import { Input } from '@/components/ui/input'
import { CURRENCIES } from '@/constants/choices'

type CurrencyInputProps = JSX.IntrinsicElements['input']

export const CurrencyInput = ({ ref, ...props }: CurrencyInputProps) => {
  const phCurrency = CURRENCIES[0]

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="border-e-none flex h-9 items-center justify-center rounded-md rounded-e-none border bg-muted-foreground/10 px-4">
        <phCurrency.icon size={16} />
      </div>

      <Input
        {...props}
        type="number"
        ref={ref}
        className="rounded-s-none border-l-0 focus-visible:outline-none focus-visible:ring-0"
      />
    </div>
  )
}
