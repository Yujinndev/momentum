'use client'

import { cn } from '@/lib/utils'
import { Pencil } from 'lucide-react'
import { Wallet } from '@/types/wallet'
import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { COLORSCHEMES } from '@/constants/choices'
import { Skeleton } from '@/components/ui/skeleton'
import { WalletForm } from '@/components/finance/wallet/form'
import { WalletCard } from '@/components/finance/wallet/card'
import { DialogFormWrapper } from '@/components/dialog-form-wrapper'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'

export function WalletList() {
  const [open, setOpen] = useState<boolean>(false)
  const walletRef = useRef<Wallet['id']>('')

  const { data: wallets, isSuccess } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => getUserWallets(),
  })

  if (!isSuccess) return <Skeleton />

  const updateWallet = wallets?.items?.find(
    (wallet) => wallet.id === walletRef.current
  )

  const handleOpenUpdateDialog = (id: Wallet['id']) => {
    walletRef.current = id
    setOpen(true)
  }

  return (
    <div className="relative flex flex-col justify-center gap-4 lg:flex-row">
      <DialogFormWrapper
        open={open}
        setOpen={() => {
          walletRef.current = ''
          return setOpen((prev) => !prev)
        }}
        title="Add New Wallet"
      >
        <WalletForm
          onSubmitCallback={() => setOpen(false)}
          wallet={updateWallet}
        />
      </DialogFormWrapper>

      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isSuccess &&
          wallets?.items?.map((wallet) => {
            const color = COLORSCHEMES.find(
              (schemes) => schemes.value === wallet.color
            )
            return (
              <div className="relative" key={wallet.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    'absolute right-2 top-2 z-30 h-8 w-8 rounded-full',
                    color?.text
                  )}
                  onClick={() => handleOpenUpdateDialog(wallet.id)}
                >
                  <Pencil size={16} />
                </Button>
                <WalletCard wallet={wallet} />
              </div>
            )
          })}
      </div>
    </div>
  )
}
