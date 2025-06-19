import React from 'react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { DetailedSavings } from '@/types/saving'
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertCircle,
  CreditCard,
} from 'lucide-react'

const statusConfig = {
  pending: {
    icon: Timer,
    class: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  'in-progress': {
    icon: AlertCircle,
    class: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  completed: {
    icon: CheckCircle2,
    class: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
}

type SavingsCardProps = {
  item: DetailedSavings
}

export const SavingsCard = ({ item }: SavingsCardProps) => {
  const progress = Math.floor(
    (Number(item.currentAmount) / Number(item.targetAmount)) * 100
  )
  const status =
    progress === 0 ? 'pending' : progress >= 1 ? 'in-progress' : 'completed'

  return (
    <div
      className={cn(
        'flex w-full shrink-0 flex-col',
        'rounded-xl shadow-sm backdrop-blur-xl',
        'bg-white dark:bg-zinc-900/70',
        'border border-zinc-100 dark:border-zinc-800',
        'hover:border-zinc-200 dark:hover:border-zinc-700',
        'transition-all duration-200'
      )}
    >
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <div className="rounded-lg bg-zinc-100 p-2 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            <CreditCard className="h-4 w-4" />
          </div>
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium',
              statusConfig[status].bg,
              statusConfig[status].class
            )}
          >
            {React.createElement(statusConfig[status].icon, {
              className: 'w-3.5 h-3.5',
            })}

            <span className="capitalize">{status}</span>
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {item.name}
          </h3>
          <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
            {item.description}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
            <span className="text-zinc-900 dark:text-zinc-100">
              {progress}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {item.targetAmount && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Php {Number(item.targetAmount).toFixed(2)}
            </span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              target
            </span>
          </div>
        )}

        {item.endDate && (
          <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            <span>{format(new Date(item.endDate), 'Ppp')}</span>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800">
        <button
          className={cn(
            'flex w-full items-center justify-center gap-2',
            'px-3 py-2.5',
            'text-xs font-medium',
            'text-zinc-600 dark:text-zinc-400',
            'hover:text-zinc-900 dark:hover:text-zinc-100',
            'hover:bg-zinc-100 dark:hover:bg-zinc-800/50',
            'transition-colors duration-200'
          )}
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
