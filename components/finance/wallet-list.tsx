'use client'

import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { WalletForm } from '@/components/finance/wallet-form'
import { WalletCard } from '@/components/finance/wallet-card'
import { DialogFormWrapper } from '@/components/dialog-form-wrapper'
import { useUserWallets } from '@/data/queries/get-user-wallets'
import { COLORSCHEMES } from '@/constants/choices'
import { Wallet } from '@/types/wallet'
import { cn } from '@/lib/utils'

export function WalletList() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWalletId, setSelectedWalletId] = useState<string>()
  const { data: wallets, isSuccess } = useUserWallets()

  const handleOpenUpdateDialog = (id: Wallet['id']) => {
    setSelectedWalletId(id)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedWalletId('')
    return setDialogOpen((prev) => !prev)
  }

  const selectedWallet = selectedWalletId
    ? wallets?.items?.find((wallet) => wallet.id === selectedWalletId)
    : undefined

  if (!isSuccess) return <Skeleton className="h-64 w-full" />

  const dialogTitle = selectedWallet ? 'Update Wallet' : 'Add New Wallet'

  return (
    <div className="relative flex gap-4">
      <DialogFormWrapper
        open={dialogOpen}
        setOpen={handleCloseDialog}
        title={dialogTitle}
      >
        <WalletForm
          onSubmitCallback={handleCloseDialog}
          wallet={selectedWallet}
        />
      </DialogFormWrapper>

      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wallets?.items?.map((wallet) => (
          <WalletCardWithEdit
            key={wallet.id}
            wallet={wallet}
            onEdit={() => handleOpenUpdateDialog(wallet.id)}
          />
        ))}
      </div>
    </div>
  )
}

const WalletCardWithEdit = ({
  wallet,
  onEdit,
}: {
  wallet: Wallet
  onEdit: () => void
}) => {
  const colorScheme = COLORSCHEMES.find(
    (scheme) => scheme.value === wallet.color
  )

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          'absolute right-2 top-2 z-30 h-8 w-8 rounded-full',
          colorScheme?.text
        )}
        onClick={onEdit}
      >
        <Pencil size={16} />
      </Button>
      <WalletCard wallet={wallet} />
    </div>
  )
}
