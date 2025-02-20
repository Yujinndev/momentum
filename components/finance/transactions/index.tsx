'use client'

import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { allColumns, displayColumns } from './data-table-columns'
import { DataTable, DataTableVariant } from './data-table'
import { getUserTransactions } from '@/actions/finance/transaction/get-user-transactions'

export default function TransactionsTable({
  variant = 'DISPLAY',
}: {
  variant?: DataTableVariant
}) {
  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getUserTransactions(),
  })

  if (!transactions?.transactions) return <Skeleton />

  return (
    <div className="container mx-auto">
      <DataTable
        variant={variant}
        data={transactions?.transactions ?? []}
        columns={variant === 'FULL' ? allColumns : displayColumns}
      />
    </div>
  )
}
