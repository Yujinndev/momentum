import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'

export const useUserWallets = () => {
  const user = useSession()

  return useQuery({
    queryKey: ['wallets', user.data?.user.email],
    queryFn: getUserWallets,
  })
}
