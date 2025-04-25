import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { AddTransactionForm } from '@/components/finance/transactions/add-form'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'
import { SectionLayout } from '@/components/layout/section-layout'
import { getUserCategories } from '@/actions/finance/category/get-user-categories'

export default async function NewTransaction() {
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: getUserCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: ['wallets'],
      queryFn: getUserWallets,
    }),
  ])

  return (
    <SectionLayout>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AddTransactionForm />
      </HydrationBoundary>
    </SectionLayout>
  )
}
