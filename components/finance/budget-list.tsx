import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { DetailedBudget } from '@/types/budget'
import { ArrowRight, ShoppingBag } from 'lucide-react'

type BudgetsProps = {
  items: DetailedBudget[]
  className?: string
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

export const Budgets = ({ items, className }: BudgetsProps) => {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        'bg-white dark:bg-zinc-900/70',
        'border border-zinc-100 dark:border-zinc-800',
        'rounded-xl shadow-sm backdrop-blur-xl',
        className
      )}
    >
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Budget Tracker
            <span className="ml-1 text-xs font-normal text-zinc-600 dark:text-zinc-400">
              ({items.length} categories)
            </span>
          </h2>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {format(new Date(), 'MMM yyyy')}
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const progress = Math.floor(item.spent / item.totalAmount)
            const status =
              progress > 100
                ? 'over-budget'
                : progress > 90
                  ? 'warning'
                  : 'on-track'

            return (
              <div
                key={item.id}
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
                        progress > 100
                          ? 'text-red-600 dark:text-red-400'
                          : progress > 90
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-zinc-900 dark:text-zinc-100'
                      )}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        progress > 100
                          ? 'bg-red-500 dark:bg-red-600'
                          : progress > 90
                            ? 'bg-amber-500 dark:bg-amber-600'
                            : 'bg-emerald-500 dark:bg-emerald-600'
                      )}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-zinc-100 p-2 dark:border-zinc-800">
        <button
          type="button"
          className={cn(
            'flex w-full items-center justify-center gap-2',
            'rounded-lg px-3 py-2',
            'text-xs font-medium',
            'bg-zinc-900 dark:bg-zinc-50',
            'text-zinc-50 dark:text-zinc-900',
            'hover:bg-zinc-800 dark:hover:bg-zinc-200',
            'shadow-sm hover:shadow',
            'transition-all duration-200'
          )}
        >
          <span>Manage Budgets</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
