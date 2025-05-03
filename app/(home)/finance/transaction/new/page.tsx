import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getUserWallets } from '@/actions/finance/wallet/get-wallets'
import { getUserCategories } from '@/actions/finance/category/get-user-categories'
import { AddTransactionForm } from '@/components/finance/transactions/add-form'

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AddTransactionForm />
    </HydrationBoundary>
  )
}
