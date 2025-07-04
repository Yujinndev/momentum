import { Budgets } from '@/components/features/budget-list'
import { DataTable } from '@/components/features/transactions'
import { SectionLayout } from '@/components/layout/section-layout'
import { transaction } from '@/components/features/transactions/columns'
import { getUserBudgets } from '@/actions/budget/get-user-budgets'
import { getUserTransactions } from '@/actions/transaction/get-user-transactions'

export default async function Page() {
  const [budgets, transactions] = await Promise.all([
    getUserBudgets(),
    getUserTransactions(),
  ])

  return (
    <div className="relative grid h-full w-full grid-cols-1 gap-4 xl:grid-cols-4">
      <Budgets
        items={budgets?.items}
        className="sticky top-0 h-max self-start"
      />

      <SectionLayout className="px-3 py-3 xl:col-span-3">
        <DataTable
          data={transactions?.items}
          columns={transaction}
          className="min-h-[105vh]"
        />
      </SectionLayout>
    </div>
  )
}
