import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { DetailedBudget } from '@/types/budget'
import { MoveRight } from 'lucide-react'
import { BudgetCard } from './budget-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type BudgetsProps = {
  items: DetailedBudget[]
  className?: string
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
            Budgets
            <span className="ml-1 text-xs font-normal text-zinc-600 dark:text-zinc-400">
              ({items.length} categories)
            </span>
          </h2>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {format(new Date(), 'MMM yyyy')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
          {items.map((item) => (
            <BudgetCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-100 p-2 dark:border-zinc-800">
        <Button className="btn-primary" asChild>
          <Link href="/budget">
            <span>Manage Budgets</span>
            <MoveRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
