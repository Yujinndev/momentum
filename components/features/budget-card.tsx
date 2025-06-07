import { cn } from '@/lib/utils'
import { DetailedBudget } from '@/types/budget'
import { ShoppingBag } from 'lucide-react'

type BudgetCardProps = {
  item: DetailedBudget
}

const statusConfig = {
  'on-track': {
    class: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  warning: {
    class: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  'over-budget': {
    class: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
}

export const BudgetCard = ({ item }: BudgetCardProps) => {
  const progress = Math.floor((item.spent / item.totalAmount) * 100)
  const status =
    progress > 100 ? 'over-budget' : progress > 90 ? 'warning' : 'on-track'

  return (
    <div
      className={cn(
        'group',
        'rounded-lg p-3',
        'border border-zinc-100 dark:border-zinc-800',
        'hover:border-zinc-200 dark:hover:border-zinc-700',
        'hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
        'transition-all duration-200'
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'rounded-lg p-1.5',
              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
            {item.name}
          </h3>
        </div>
        <div
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
            statusConfig[status].bg,
            statusConfig[status].class
          )}
        >
          {status}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <p className="text-zinc-600 dark:text-zinc-400">
            {item.spent} of {item.totalAmount}{' '}
            <small className="capitalize">
              ({item?.recurringPeriod?.toLowerCase()})
            </small>
          </p>
          <span
            className={cn(
              'font-medium',
              {
                'text-red-600 dark:text-red-400': status === 'over-budget',
              },
              {
                'text-amber-600 dark:text-amber-400': status === 'warning',
              },
              {
                'text-zinc-900 dark:text-zinc-100': status === 'on-track',
              }
            )}
          >
            {progress}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={cn(
              'h-full rounded-full',
              {
                'bg-red-500 dark:bg-red-600': status === 'over-budget',
              },
              {
                'bg-amber-500 dark:bg-amber-600': status === 'warning',
              },
              {
                'bg-emerald-500 dark:bg-emerald-600': status === 'on-track',
              }
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
