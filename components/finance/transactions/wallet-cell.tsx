'use client'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { getColorScheme } from '@/utils/get-values-from-choices'
import { useUserWallets } from '@/data/queries/get-user-wallets'

interface WalletCellProps {
  walletId: string
}

export function WalletCell({ walletId }: WalletCellProps) {
  const { data: wallets, isSuccess, isLoading } = useUserWallets()

  if (!isSuccess || isLoading) return <Skeleton />

  const wallet = wallets?.items?.find(({ id }) => id === walletId)
  const color = getColorScheme(wallet?.color!)

  return (
    <div
      className={cn(
        'w-20 rounded border bg-muted-foreground/10 py-1 text-center text-xs font-medium',
        color?.secondary,
        color?.text
      )}
    >
      {wallet?.name ?? 'No Wallet'}
    </div>
  )
}
