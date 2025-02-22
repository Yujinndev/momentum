import { getUserFinancialProfile } from '@/actions/account/get-user-financial-profile'
import { useQuery } from '@tanstack/react-query'

export const useUserFinancialProfile = () => {
  return useQuery({
    queryKey: ['financial-profle'],
    queryFn: getUserFinancialProfile,
  })
}
