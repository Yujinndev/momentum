import { cn } from '@/lib/utils'
import { DetailedSavings } from '@/types/saving'
import { SavingsCard } from '@/components/features/savings-card'

type SavingsProps = {
  items: DetailedSavings[]
  className?: string
}

export const Savings = ({ items, className }: SavingsProps) => {
  const goalsCount = items.length

  return (
    <div className={cn('scrollbar-none w-full overflow-x-auto', className)}>
      <section>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Savings Goals
          </h2>
          <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400">
            {goalsCount}
            {goalsCount > 1 ? ' Goals' : ' Goal'}
          </span>
        </div>

        {items.length > 0 ? (
          <div className="grid min-w-full gap-3 p-4 lg:grid-cols-3">
            {items.map((item) => {
              return <SavingsCard key={item.id} item={item} />
            })}
          </div>
        ) : (
          <div className="group flex items-center justify-center gap-3 rounded-lg p-2">
            <h3 className="text-xs font-medium text-muted-foreground">
              No savings goal found.
            </h3>
          </div>
        )}
      </section>
    </div>
  )
}
