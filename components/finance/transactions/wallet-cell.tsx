'use client'

import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { getColorScheme } from '@/utils/get-values-from-choices'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'

interface WalletCellProps {
  walletId: string
}

export function WalletCell({ walletId }: WalletCellProps) {
  const { data: wallets, isSuccess } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => getUserWallets(),
  })

  if (!isSuccess) return <Skeleton />

  const wallet = wallets?.items?.find((wallet) => wallet.id === walletId)
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
