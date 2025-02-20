'use client'

import { BentoCard } from '@/components/ui/bento-card'
import { Skeleton } from '@/components/ui/skeleton'
import { CURRENCIES } from '@/constants/choices'
import { useUserFinancialProfile } from '@/data/queries/user-financial-profile'

export const FinanceStats = () => {
  const { data, isFetching } = useUserFinancialProfile()

  if (!data?.profile || isFetching) return <Skeleton />

  const { profile } = data
  const currency = CURRENCIES.find(
    (currency) => currency.value === profile.currency
  )

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row">
      <BentoCard title="Currency" className="gap-4">
        {currency?.icon && <currency.icon size={40} className="rounded-full" />}
        <p>{currency?.label}</p>
      </BentoCard>

      <BentoCard
        title="Total Expenses"
        className="pb-5 text-red-400 dark:text-red-600"
      >
        {currency?.icon && <currency.icon size={16} className="rounded-full" />}
        <p className="text-2xl">{profile.totalExpenses.toFixed(2)}</p>
      </BentoCard>

      <BentoCard
        title="Total Income"
        className="pb-5 text-green-400 dark:text-green-600"
      >
        {currency?.icon && <currency.icon size={16} className="rounded-full" />}
        <p className="text-2xl">{profile.totalIncome.toFixed(2)}</p>
      </BentoCard>
    </div>
  )
}
