import { useQuery } from '@tanstack/react-query'
import { getUserCategories } from '@/actions/finance/category/get-user-categories'
import { useSession } from 'next-auth/react'

export const useUserCategories = () => {
  const user = useSession()

  return useQuery({
    queryKey: ['categories', user.data?.user.email],
    queryFn: getUserCategories,
  })
}
