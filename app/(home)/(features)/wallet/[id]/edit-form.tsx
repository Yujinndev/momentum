'use client'

import { DialogFormWrapper } from '@/components/dialog-form-wrapper'
import { WalletForm } from '@/components/features/wallet-form'
import { WalletWithId } from '@/types/wallet'
import { Pencil } from 'lucide-react'
import { useState } from 'react'

type EditWalletFormProps = {
  wallet: WalletWithId
}

export const EditWalletForm = ({ wallet }: EditWalletFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCloseDialog = () => setDialogOpen((prev) => !prev)

  return (
    <DialogFormWrapper
      open={dialogOpen}
      setOpen={handleCloseDialog}
      title="Update Wallet"
      icon={<Pencil className="text-primary" />}
    >
      <WalletForm
        wallet={wallet}
        onSubmitCallback={handleCloseDialog}
        showBackButton={false}
      />
    </DialogFormWrapper>
  )
}
