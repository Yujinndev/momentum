'use client'

import { getUserFinancialProfile } from '@/actions/account/get-user-financial-profile'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { CURRENCIES } from '@/constants/choices'
import { cn } from '@/lib/utils'

export default function Profile() {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getUserFinancialProfile(),
  })

  if (!data?.profile || isLoading) return <Skeleton />

  const { profile } = data
  const currency = CURRENCIES.find(
    (currency) => currency.value === profile.currency
  )

  return (
    <div className="relative flex h-full gap-4">
      <div className="w-full space-y-4">
        <div className="rounded border bg-muted/50 px-4 py-8">
          <Breadcrumb className="pb-3">
            <BreadcrumbList>
              <BreadcrumbItem>Account</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Financial</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-4 h-px w-full bg-muted/70" />

          <div className="space-y-1">
            <h2 className="text-3xl font-semibold">{profile.name}</h2>
            <p className="text-muted-foreground">{profile?.description}</p>
          </div>
        </div>

        <div className="flex w-full gap-4">
          <BentoCard title="Currency" className="flex-col">
            {currency?.icon && (
              <currency.icon size={40} className="rounded-full" />
            )}
            <p>{currency?.label}</p>
          </BentoCard>

          <BentoCard
            title="Total Expenses"
            className="pb-5 text-red-400 dark:text-red-600"
          >
            {currency?.icon && (
              <currency.icon size={16} className="rounded-full" />
            )}
            <p className="text-2xl">{profile.totalExpenses.toFixed(2)}</p>
          </BentoCard>

          <BentoCard
            title="Total Income"
            className="pb-5 text-green-400 dark:text-green-600"
          >
            {currency?.icon && (
              <currency.icon size={16} className="rounded-full" />
            )}
            <p className="text-2xl">{profile.totalIncome.toFixed(2)}</p>
          </BentoCard>
        </div>
      </div>
    </div>
  )
}

export const BentoCard = ({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div className="w-full rounded border bg-muted/50 p-4">
      <Breadcrumb className="pb-3">
        <BreadcrumbList>
          <BreadcrumbEllipsis />
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-4 h-px w-full bg-muted/70" />

      <div
        className={cn('flex items-center justify-center gap-y-4', className)}
      >
        {children}
      </div>
    </div>
  )
}
