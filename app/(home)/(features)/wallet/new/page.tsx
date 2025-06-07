'use client'

import { useRouter } from 'next/navigation'
import { WalletForm } from '@/components/features/wallet-form'

export default function Page() {
  const router = useRouter()
  const handleBackToDashboard = () => router.replace('/dashboard')

  return (
    <div className="py-3 lg:pt-6">
      <WalletForm
        className="max-w-screen-xl"
        onSubmitCallback={handleBackToDashboard}
      />
    </div>
  )
}
