'use client'

import { MouseEvent, useState } from 'react'
import { Loader2, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WalletWithId } from '@/types/wallet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { deleteWallet } from '@/actions/finance/wallet/delete-wallet'

type DeleteWalletFormProps = {
  wallet: WalletWithId
}

export const DeleteWalletForm = ({ wallet }: DeleteWalletFormProps) => {
  const router = useRouter()
  const [isPendingAction, setIsPendingAction] = useState(false)

  const handleOnDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    setIsPendingAction(true)

    await deleteWallet({ id: wallet.id })

    setIsPendingAction(false)
    e.preventDefault()

    router.replace('/dashboard')
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border bg-muted-foreground/10 py-4 text-center">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-12 rounded-full"
          >
            <Trash className="text-destructive" />
          </Button>

          <h3 className="text-sm font-semibold">Delete Wallet</h3>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            wallet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => handleOnDelete(e)}
            className="btn-primary"
          >
            {isPendingAction && <Loader2 className="animate-spin" />} Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
