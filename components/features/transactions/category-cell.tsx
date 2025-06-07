'use client'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { TRANSACTION_TYPES } from '@/constants/choices'
import { useUserCategories } from '@/data/queries/get-user-categories'

type WalletCellProps = {
  categoryId: number
  type: string
}

export function CategoryCell({ categoryId, type }: WalletCellProps) {
  const { data: categories, isSuccess, isLoading } = useUserCategories()

  if (!isSuccess || isLoading) return <Skeleton />

  const category = categories?.items?.find(({ id }) => id === categoryId)
  const txType = TRANSACTION_TYPES.find(({ value }) => value === type)

  return (
    <div
      className={cn(
        'w-max rounded-lg p-2 lg:px-4',
        'flex items-center justify-center gap-4',
        'bg-zinc-100 dark:bg-zinc-800',
        'border border-zinc-200 dark:border-zinc-700'
      )}
    >
      {txType && (
        <txType.icon className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
      )}

      <small>{category?.name}</small>
    </div>
  )
}
