import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'
import { getUserCategories } from '@/actions/finance/category/get-user-categories'
import { AddTransactionForm } from '@/components/finance/transactions/add-form'

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
