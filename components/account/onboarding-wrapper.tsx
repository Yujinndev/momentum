'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { ONBOARDING_STEPS } from '@/constants/config'
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation'

type OnboardingWrapperProps = {
  children: React.ReactNode
}

export const OnboardingWrapper = ({ children }: OnboardingWrapperProps) => {
  const {
    onboardingState: { index, length },
  } = useOnboardingNavigation()
  const currentStagePercentage = Math.floor((index / length) * 100)

  return (
    <div className="relative mx-auto grid h-full w-full max-w-7xl gap-8 px-2 py-3 lg:grid-cols-3 lg:px-8 lg:py-16">
      <div
        className={cn(
          'mx-auto h-max w-full flex-1 px-6 py-7 lg:sticky lg:top-8',
          'bg-white dark:bg-zinc-900/70',
          'border border-zinc-100 dark:border-zinc-800',
          'rounded-xl shadow-sm backdrop-blur-xl'
        )}
      >
        <div className="w-full">
          <div
            className="mb-2 inline-block rounded-lg border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-400 dark:border-blue-400 dark:bg-blue-400/30 dark:text-blue-400"
            style={{ marginLeft: `calc(${currentStagePercentage}% - 20px)` }}
          >
            {currentStagePercentage}%
          </div>
          <div
            className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700"
            role="progressbar"
            aria-valuenow={currentStagePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-blue-100 text-center text-xs text-white transition duration-500 dark:bg-blue-400"
              style={{ width: `${currentStagePercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-8">
          {ONBOARDING_STEPS.map((step, i) => {
            const alreadyDone = index - 1 >= i
            const isCurrentStep = index === i

            return (
              <div key={step.link} className="flex w-full items-center gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border',
                    { 'border-blue-400': isCurrentStep },
                    { 'bg-primary': alreadyDone }
                  )}
                >
                  {alreadyDone ? <Check /> : <span>{i + 1}</span>}
                </div>
                <p
                  className={cn('text-bold', {
                    'text-blue-400': isCurrentStep,
                  })}
                >
                  {step.name}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mx-auto w-full flex-1 space-y-4 lg:col-span-2">
        {children}
      </div>
    </div>
  )
}
