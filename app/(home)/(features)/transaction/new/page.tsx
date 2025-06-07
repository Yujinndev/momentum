import { getUserWallets } from '@/actions/wallet/get-user-wallets'
import { getUserCategories } from '@/actions/category/get-user-categories'
import { AddTransactionForm } from '@/components/features/transactions/add-form'

export default async function NewTransaction() {
  const [wallets, categories] = await Promise.all([
    getUserWallets(),
    getUserCategories(),
  ])

  return (
    <AddTransactionForm
      wallets={wallets.items}
      categories={categories?.items}
      className="max-w-screen-xl"
    />
  )
}
