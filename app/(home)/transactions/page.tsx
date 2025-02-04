import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import TransactionsTable from '@/components/finance/transactions'
import { getUserTransactions } from '@/actions/finance/transaction/get-user-transactions'
import { SectionLayout } from '@/components/layout/section-layout'

export default async function Transactions() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['transactions'],
    queryFn: getUserTransactions,
  })

  return (
    <SectionLayout>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TransactionsTable variant="FULL" />
      </HydrationBoundary>
    </SectionLayout>
  )
}
