import Link from 'next/link'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import { EditWalletForm } from './edit-form'
import { DeleteWalletForm } from './delete-form'
import { getWallet } from '@/actions/wallet/get-wallet'
import { TransactionList } from '@/components/features/transaction-list'
import { WalletCard } from '@/components/features/wallet-card'
import { Button } from '@/components/ui/button'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const response = await getWallet({ walletId: id })

  if (!response.wallet) {
    redirect(`/wallet/${id}`)
  }

  return (
    <div className="relative grid h-full w-full gap-4 lg:grid-cols-3">
      <div className="sticky top-8 h-max space-y-4 self-start">
        <WalletCard wallet={response.wallet} />

        <div className="relative flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border bg-muted-foreground/10 py-4 text-center">
          <Button
            variant="outline"
            className="btn-primary group h-12 w-12 rounded-full"
            asChild
          >
            <Link href={`/transaction/new?wallet-id=${response.wallet.id}`}>
              <Plus className="group-hover:text-black" />
            </Link>
          </Button>

          <h3 className="text-sm font-semibold">Add New Transaction</h3>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <DeleteWalletForm wallet={response.wallet} />
          <EditWalletForm wallet={response.wallet} />
        </div>
      </div>

      <TransactionList
        items={response.wallet.transactions}
        title="Wallet's Activity"
        showViewAll={false}
        className="min-h-[80vh] lg:col-span-2"
      />
    </div>
  )
}
