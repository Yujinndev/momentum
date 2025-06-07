'use client'

import { WalletForm } from '@/components/features/wallet-form'
import { SectionLayout } from '@/components/layout/section-layout'
import { OnboardingWrapper } from '@/components/account/onboarding-wrapper'
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation'

export default function WalletCreation() {
  const { handleNextPage } = useOnboardingNavigation()

  return (
    <OnboardingWrapper>
      <SectionLayout>
        <WalletForm onSubmitCallback={handleNextPage} />
      </SectionLayout>
    </OnboardingWrapper>
  )
}
