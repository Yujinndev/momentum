'use client'

import { WalletForm } from '@/components/features/wallet-form'
import { OnboardingWrapper } from '@/components/account/onboarding-wrapper'
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation'

export default function WalletCreation() {
  const { handleNextPage } = useOnboardingNavigation()

  return (
    <OnboardingWrapper>
      <WalletForm onSubmitCallback={handleNextPage} showBackButton={false} />
    </OnboardingWrapper>
  )
}
