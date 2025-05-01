import { Wallet } from '@/types/wallet'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createWallet } from '@/actions/finance/wallet/create-wallet'
import { updateWallet } from '@/actions/finance/wallet/update-wallet'
import { deleteWallet } from '@/actions/finance/wallet/delete-wallet'

type WalletMutationArgs = {
  values: Wallet
  type: 'CREATE' | 'UPDATE' | 'DELETE'
}

export const useWalletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ values, type }: WalletMutationArgs) => {
      if (type !== 'CREATE' && !values.id) {
        throw new Error('Wallet ID is required for this operation')
      }

      switch (type) {
        case 'CREATE':
          return await createWallet({ values })
        case 'UPDATE':
          return await updateWallet({ values, id: values.id! })
        case 'DELETE':
          return await deleteWallet({ id: values.id! })
        default:
          throw new Error(`Invalid mutation type: ${type}`)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['wallets'],
      })
    },
  })
}
