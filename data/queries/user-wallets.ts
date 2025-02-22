import { useQuery } from '@tanstack/react-query'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'

export const useUserWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: getUserWallets,
  })
}
