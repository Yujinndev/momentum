import { cn } from '@/lib/utils'
import { DetailedBudget } from '@/types/budget'
import { format } from 'date-fns'
import { ShoppingBag } from 'lucide-react'

type BudgetCardProps = {
  item: DetailedBudget
}

const statusConfig = {
  'on-track': {
    text: 'text-zinc-900 dark:text-zinc-100',
    bg: 'bg-emerald-500 dark:bg-emerald-600',
  },
  warning: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500 dark:bg-amber-600',
  },
  'over-budget': {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500 dark:bg-red-600',
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
            statusConfig[status].text
          )}
        >
          {status}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <p className="text-zinc-600 dark:text-zinc-400">
            Php {item.spent} of Php {item.totalAmount}
          </p>

          <span className={cn('font-medium', statusConfig[status].text)}>
            {progress}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={cn('h-full rounded-full', statusConfig[status].bg)}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <p className="text-zinc-600 dark:text-zinc-500">
            {format(item.endDate, 'PPp')}
          </p>

          <span className="font-medium capitalize dark:text-zinc-500">
            {item.recurringPeriod}
          </span>
        </div>
      </div>
    </div>
  )
}
