import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { getUserCategories } from '@/actions/category/get-user-categories'

export const useUserCategories = () => {
  const user = useSession()

  return useQuery({
    queryKey: ['categories', user.data?.user.email],
    queryFn: getUserCategories,
  })
}
