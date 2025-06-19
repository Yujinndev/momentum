import { cn } from '@/lib/utils'
import { DetailedSavings } from '@/types/saving'
import { SavingsCard } from '@/components/features/savings-card'

type SavingsProps = {
  items: DetailedSavings[]
  className?: string
}

export const Savings = ({ items, className }: SavingsProps) => {
  return (
    <div className={cn('scrollbar-none w-full overflow-x-auto', className)}>
      {items.length > 0 ? (
        <div className="grid min-w-full gap-3 p-1 lg:grid-cols-3">
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
    </div>
  )
}
