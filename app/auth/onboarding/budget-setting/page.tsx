'use client'

import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation'
import { OnboardingWrapper } from '@/components/account/onboarding-wrapper'
import { BudgetSettingForm } from '@/components/finance/budget-form'

export default function BudgetSetting() {
  const { handleNextPage } = useOnboardingNavigation()

  return (
    <OnboardingWrapper>
      <BudgetSettingForm onSubmitCallback={handleNextPage} />
    </OnboardingWrapper>
  )
}
