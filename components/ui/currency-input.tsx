'use client'

import type { JSX } from 'react'
import { Input } from './input'
import { useUserFinancialProfile } from '@/data/queries/user-financial-profile'
import { CURRENCIES } from '@/constants/choices'
import { getCurrency } from '@/utils/get-values-from-choices'

type CurrencyInputProps = JSX.IntrinsicElements['input']

export const CurrencyInput = ({ ref, ...props }: CurrencyInputProps) => {
  const { data, isSuccess } = useUserFinancialProfile()

  if (!isSuccess) return <Input {...props} ref={ref} />

  const currency = getCurrency(data?.profile?.currency)

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="border-e-none flex h-9 items-center justify-center rounded-md rounded-e-none border bg-muted-foreground/10 px-4">
        <currency.icon size={16} />
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
