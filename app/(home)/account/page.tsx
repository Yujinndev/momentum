import Session from './session'
import { SectionLayout } from '@/components/layout/section-layout'
import { QueryClient } from '@tanstack/react-query'
import { getUserFinancialProfile } from '@/actions/account/get-user-financial-profile'
import Profile from './profile'

export default async function Account() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['profile'],
    queryFn: getUserFinancialProfile,
  })

  return (
    <SectionLayout className="flex items-center justify-center">
      <div className="grid h-full w-full gap-4 lg:grid-cols-4">
        <Session />

        <div className="h-full w-full lg:col-span-3">
          <Profile />
        </div>
      </div>
    </SectionLayout>
  )
}
