import { WalletList } from '@/components/finance/wallet/list'
import TransactionsTable from '@/components/finance/transactions'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { SectionLayout } from '@/components/layout/section-layout'

export default async function Dashboard() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['wallets'],
    queryFn: getUserWallets,
  })

  return (
    <SectionLayout className="flex w-full flex-col gap-x-4 gap-y-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WalletList />

        <div className="grid h-full gap-4 lg:grid-cols-2">
          <TransactionsTable />
          <div className="h-full min-h-40 w-full rounded-md border bg-muted/50" />
        </div>
      </HydrationBoundary>
    </SectionLayout>
  )
}
