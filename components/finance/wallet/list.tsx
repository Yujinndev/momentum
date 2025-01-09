'use client'

import { Plus } from 'lucide-react'
import { WalletCard } from './card'
import { AddWalletForm } from './add-form'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export function WalletList() {
  const [open, setOpen] = useState<boolean>(false)

  const { data: wallets, isSuccess } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => getUserWallets(),
  })

  const handleCloseDialog = () => {
    setOpen(false)
  }

  return (
    <div className="relative flex flex-col justify-center gap-4 lg:flex-row">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex aspect-video h-28 w-full flex-col items-center justify-center gap-2 rounded-xl bg-muted-foreground/10 text-center lg:h-40 lg:w-20">
          <DialogTrigger asChild>
            <Button variant="outline" className="h-12 w-12 rounded-full">
              <Plus />
            </Button>
          </DialogTrigger>
          <h3 className="text-sm font-semibold">Add new wallet</h3>
        </div>
        <DialogContent className="sm:max-w-md">
          <VisuallyHidden>
            <DialogTitle>Add Wallet Form</DialogTitle>
          </VisuallyHidden>
          <AddWalletForm onSubmitCallback={handleCloseDialog} />
        </DialogContent>
      </Dialog>

      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isSuccess &&
          wallets?.items?.map((wallet) => (
            <WalletCard key={wallet.id} details={wallet} />
          ))}
      </div>
    </div>
  )
}
