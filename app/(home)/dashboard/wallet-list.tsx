'use client'

import { useState } from 'react'
import { WalletWithId } from '@/types/wallet'
import { WalletForm } from '@/components/finance/wallet-form'
import { WalletCard } from '@/components/finance/wallet-card'
import { DialogFormWrapper } from '@/components/dialog-form-wrapper'

type WalletListProps = {
  items: WalletWithId[]
}

export function WalletList({ items }: WalletListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWalletId, setSelectedWalletId] = useState<string>()

  const handleOpenUpdateDialog = (id: WalletWithId['id']) => {
    setSelectedWalletId(id)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedWalletId('')
    return setDialogOpen((prev) => !prev)
  }

  const selectedWallet = selectedWalletId
    ? items.find((wallet) => wallet.id === selectedWalletId)
    : undefined

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
        {items.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            onEdit={() => handleOpenUpdateDialog(wallet.id)}
          />
        ))}
      </div>
    </div>
  )
}
