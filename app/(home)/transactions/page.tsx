import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { TransactionsTable } from '@/components/finance/transactions'
import { SectionLayout } from '@/components/layout/section-layout'
import { getUserTransactions } from '@/actions/finance/transaction/get-user-transactions'

export default async function Transactions() {
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['transactions'],
      queryFn: getUserTransactions,
    }),
  ])

  return (
    <SectionLayout>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="space-y-8">
          <TransactionsTable variant="FULL" />
        </div>
      </HydrationBoundary>
    </SectionLayout>
  )
}
