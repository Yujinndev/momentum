'use client'

import { useState } from 'react'
import { WalletCard } from './card'
import { AddWalletForm } from './add-form'
import { useQuery } from '@tanstack/react-query'
import { DialogFormWrapper } from '@/components/dialog-form-wrapper'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'

export function WalletList() {
  const [open, setOpen] = useState<boolean>(false)

  const { data: wallets, isSuccess } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => getUserWallets(),
  })

  return (
    <div className="relative flex flex-col justify-center gap-4 lg:flex-row">
      <DialogFormWrapper open={open} setOpen={setOpen} title="Add New Wallet">
        <AddWalletForm onSubmitCallback={() => setOpen(false)} />
      </DialogFormWrapper>

      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isSuccess &&
          wallets?.items?.map((wallet) => (
            <WalletCard key={wallet.id} details={wallet} />
          ))}
      </div>
    </div>
  )
}
