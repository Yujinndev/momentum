'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { ONBOARDING_STEPS } from '@/constants/config'

export const useOnboardingNavigation = () => {
  const { update } = useSession()

  const router = useRouter()
  const pathname = usePathname()
  const onboardingState = getOnboardingState(pathname)

  const handleNextPage = async () => {
    if (onboardingState.isCompleting) {
      await update({ onboardingCompleted: true })

      return router.push('/dashboard')
    }

    router.push(onboardingState.nextUrl)
  }

  return { onboardingState, handleNextPage }
}

const getOnboardingState = (currentPage: string) => {
  const totalSteps = ONBOARDING_STEPS.length
  const currentPageIndex = ONBOARDING_STEPS.findIndex(
    (route) => route.link === currentPage
  )

  const nextRouteIndex = Math.min(Math.max(0, currentPageIndex + 1), totalSteps)

  const nextStep = ONBOARDING_STEPS[nextRouteIndex]

  return {
    length: totalSteps,
    index: currentPageIndex,
    nextUrl: nextStep ? nextStep.link : '/',
    isCompleting: nextRouteIndex === totalSteps,
  }
}
