import { WalletList } from './wallet-list'
import { TransactionList } from './transaction-list'
import { SectionLayout } from '@/components/layout/section-layout'
import { getUserTransactions } from '@/actions/finance/transaction/get-user-transactions'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'

export default async function Dashboard() {
  const [transactions, wallets] = await Promise.all([
    getUserTransactions(),
    getUserWallets(),
  ])

  return (
    <section className="flex w-full flex-col gap-x-4 gap-y-8">
      <WalletList items={wallets.items} />

      <div className="grid h-full gap-4 lg:grid-cols-2">
        <TransactionList items={transactions.items} count={5} />
        <SectionLayout />
      </div>
    </section>
  )
}
