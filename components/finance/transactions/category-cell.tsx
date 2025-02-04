'use client'

import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { COLORSCHEMES } from '@/constants/choices'
import { getUserCategories } from '@/actions/finance/category/get-user-categories'

interface WalletCellProps {
  categoryId: number
}

export function CategoryCell({ categoryId }: WalletCellProps) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getUserCategories(),
  })

  const category = categories?.items?.find(
    (category) => category.id === categoryId
  )
  const color = COLORSCHEMES.find((scheme) => scheme.value === category?.color)

  return (
    <span
      className={cn(
        'rounded-full px-2 py-1 text-right text-xs font-medium',
        color?.secondary,
        color?.text
      )}
    >
      {category?.name}
    </span>
  )
}
