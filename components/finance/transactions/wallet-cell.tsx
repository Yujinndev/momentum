'use client'

import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'
import { COLORSCHEMES } from '@/constants/choices'

interface WalletCellProps {
  walletId: string
}

export function WalletCell({ walletId }: WalletCellProps) {
  const { data: wallets } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => getUserWallets(),
  })

  const wallet = wallets?.items?.find((wallet) => wallet.id === walletId)
  const color = COLORSCHEMES.find((scheme) => scheme.value === wallet?.color)

  return (
    <div
      className={cn(
        'w-20 rounded py-1 text-center text-xs font-medium',
        color?.secondary,
        color?.text
      )}
    >
      {wallet?.name}
    </div>
  )
}
