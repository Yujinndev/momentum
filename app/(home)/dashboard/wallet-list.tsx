'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { WalletWithId } from '@/types/wallet'
import { WalletCard } from '@/components/features/wallet-card'
import { Button } from '@/components/ui/button'

type WalletListProps = {
  items: WalletWithId[]
}

export function WalletList({ items }: WalletListProps) {
  const router = useRouter()

  const handleViewWalletDetails = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const wallet = target.closest('.wallet-card')

    if (wallet) {
      const id = wallet.getAttribute('data-id')
      router.push(`/wallet/${id}`)
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col gap-4 lg:flex-row">
      <div className='"h-24 relative flex flex-col items-center justify-center gap-2 rounded-xl border bg-muted-foreground/10 py-4 text-center lg:h-40 lg:w-40'>
        <Button
          type="button"
          variant="outline"
          className="h-12 w-12 rounded-full"
          asChild
        >
          <Link href="/wallet/new">
            <Plus />
          </Link>
        </Button>
        <h3 className="text-sm font-semibold">Add New Wallet</h3>
      </div>

      <div
        className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3"
        onClick={handleViewWalletDetails}
      >
        {items.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            className="cursor-pointer"
          />
        ))}
      </div>
    </div>
  )
}
