import Link from 'next/link'
import { SectionLayout } from '@/components/layout/section-layout'
import { OnboardingWrapper } from '@/components/account/onboarding-wrapper'
import { Button } from '@/components/ui/button'

export default function StartOnboarding() {
  return (
    <OnboardingWrapper>
      <SectionLayout />

      <SectionLayout>
        <Button asChild>
          <Link href="/auth/onboarding/wallet">Next</Link>
        </Button>
      </SectionLayout>
    </OnboardingWrapper>
  )
}
