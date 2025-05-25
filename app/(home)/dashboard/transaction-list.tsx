import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TRANSACTION_TYPES } from '@/constants/choices'
import { ArrowUpRight, ArrowDownLeft, ArrowRight } from 'lucide-react'
import { DetailedTransaction } from '@/types/transaction'
import { formatTransactionDate } from '@/utils/date'
import { cn } from '@/lib/utils'

interface TransactionListProps {
  items: DetailedTransaction[]
  count?: number
  className?: string
}

export const TransactionList = ({
  items,
  count = 5,
  className,
}: TransactionListProps) => {
  const transactionsCount = items.length

  return (
    <div
      className={cn(
        'mx-auto flex min-h-96 w-full flex-col',
        'bg-white dark:bg-zinc-900/70',
        'border border-zinc-100 dark:border-zinc-800',
        'rounded-xl shadow-sm backdrop-blur-xl',
        className
      )}
    >
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Activity
          </h2>
          <span className="ml-1 text-xs font-normal text-zinc-600 dark:text-zinc-400">
            {transactionsCount}
            {transactionsCount > 1 ? ' transactions' : ' transaction'}
          </span>
        </div>

        <div className="space-y-1">
          {items.slice(0, count).map((transaction) => {
            const txType = TRANSACTION_TYPES.find(
              (txType) => txType.value === transaction.type
            )

            return (
              <div
                key={transaction.id}
                className={cn(
                  'group flex items-center gap-3',
                  'rounded-lg p-2',
                  'hover:bg-zinc-100 dark:hover:bg-zinc-800/50',
                  'transition-all duration-200'
                )}
              >
                <div
                  className={cn(
                    'rounded-lg p-2',
                    'bg-zinc-100 dark:bg-zinc-800',
                    'border border-zinc-200 dark:border-zinc-700'
                  )}
                >
                  {txType && (
                    <txType.icon className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {transaction.description}
                    </h3>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      {formatTransactionDate(transaction.transactionDate)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pl-3">
                    <span
                      className={cn(
                        'text-xs font-medium',
                        transaction.type === 'EXPENSE'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      )}
                    >
                      {transaction.type === 'EXPENSE' ? '-' : '+'}
                      {transaction.amount.toFixed(2)}
                    </span>
                    {transaction.type === 'EXPENSE' ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    ) : (
                      <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-full" />

      <div className="border-t border-zinc-100 p-2 dark:border-zinc-800">
        <Button
          className={cn(
            'flex w-full items-center justify-center gap-2',
            'rounded-lg px-3 py-2',
            'text-xs font-medium',
            'bg-gradient-to-r from-zinc-900 to-zinc-800',
            'dark:from-zinc-50 dark:to-zinc-200',
            'text-zinc-50 dark:text-zinc-900',
            'hover:from-zinc-800 hover:to-zinc-700',
            'dark:hover:from-zinc-200 dark:hover:to-zinc-300',
            'shadow-sm hover:shadow',
            'transform transition-all duration-200',
            'hover:-translate-y-0.5',
            'active:translate-y-0',
            'focus:outline-none focus:ring-2',
            'focus:ring-zinc-500 dark:focus:ring-zinc-400',
            'focus:ring-offset-2 dark:focus:ring-offset-zinc-900'
          )}
          asChild
        >
          <Link href="/finance">
            <span>View All Transactions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
