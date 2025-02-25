import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import TransactionsTable from '@/components/finance/transactions'
import { SectionLayout } from '@/components/layout/section-layout'
import { getUserFinancialProfile } from '@/actions/account/get-user-financial-profile'
import { getUserTransactions } from '@/actions/finance/transaction/get-user-transactions'
import { FinanceStats } from '@/components/finance/stats'

export default async function Transactions() {
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['transactions'],
      queryFn: getUserTransactions,
    }),

    queryClient.prefetchQuery({
      queryKey: ['financial-profle'],
      queryFn: getUserFinancialProfile,
    }),
  ])

  return (
    <SectionLayout>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="space-y-8">
          <FinanceStats />

          <TransactionsTable variant="FULL" />
        </div>
      </HydrationBoundary>
    </SectionLayout>
  )
}
