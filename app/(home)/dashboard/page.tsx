import { WalletList } from '@/components/finance/wallet/list'
import TransactionsTable from '@/components/finance/transactions'

export default async function Dashboard() {
  return (
    <section className="flex w-full flex-col gap-4 gap-y-8 px-4">
      <WalletList />

      <div className="grid grid-cols-2">
        <TransactionsTable />
      </div>
    </section>
  )
}
