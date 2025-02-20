'use client'

import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { getColorScheme } from '@/utils/get-values-from-choices'
import { getUserCategories } from '@/actions/finance/category/get-user-categories'

type WalletCellProps = {
  categoryId: number
}

export function CategoryCell({ categoryId }: WalletCellProps) {
  const { data: categories, isSuccess } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getUserCategories(),
  })

  if (!isSuccess) return <Skeleton />

  const category = categories?.items?.find(
    (category) => category.id === categoryId
  )

  const color = getColorScheme(category?.color!)

  return (
    <div
      className={cn(
        `w-28 rounded-full border bg-muted-foreground/10 px-2 py-1 text-center text-xs font-medium`,
        color.border
      )}
    >
      {category?.name}
    </div>
  )
}
