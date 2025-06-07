'use client'

import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation'
import { OnboardingWrapper } from '@/components/account/onboarding-wrapper'
import { BudgetSettingForm } from '@/components/features/budget-form'
import { completeUserOnboarding } from '@/actions/account/complete-onboarding'

export const BudgetSetting = () => {
  const { handleNextPage } = useOnboardingNavigation()

  return (
    <OnboardingWrapper>
      <BudgetSettingForm
        onSubmitCallback={async () => {
          handleNextPage()
          await completeUserOnboarding()
        }}
      />
    </OnboardingWrapper>
  )
}
