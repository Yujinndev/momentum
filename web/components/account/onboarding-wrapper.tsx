'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { ONBOARDING_STEPS } from '@/constants/config'
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation'

type OnboardingWrapperProps = {
  children: React.ReactNode
  direction?: 'vertical' | 'horizontal'
}

export const OnboardingWrapper = ({
  children,
  direction = 'vertical',
}: OnboardingWrapperProps) => {
  const {
    onboardingState: { index: currentIndex, length },
  } = useOnboardingNavigation()
  const currentStagePercentage = Math.floor((currentIndex / length) * 100)
  const isVertical = direction === 'vertical'

  return (
    <div
      className={cn(
        'relative mx-auto grid h-full w-full max-w-7xl gap-8 px-2 py-3 lg:grid-cols-1 lg:py-16',
        { 'lg:grid-cols-4': isVertical }
      )}
    >
      <div
        className={cn(
          'mx-auto flex flex-1 flex-col items-center justify-center gap-6',
          'relative h-max w-full px-4 pb-4 pt-6',
          'bg-white dark:bg-zinc-900/70',
          'border border-zinc-100 dark:border-zinc-800',
          'rounded-xl shadow-sm backdrop-blur-xl'
        )}
      >
        <div
          className={cn(
            'relative flex h-full w-full flex-row justify-between gap-6',
            {
              'min-w-fit flex-col': isVertical,
            }
          )}
        >
          {isVertical ? (
            <>
              <div className="absolute bottom-6 left-6 top-6 z-10 w-0.5 bg-gray-200 dark:bg-neutral-700" />
              <div
                className="absolute left-6 top-6 z-20 w-0.5 bg-blue-400 transition-all duration-500 ease-out dark:bg-blue-400"
                style={{ height: `calc(${currentStagePercentage}% - 8px)` }}
              />
            </>
          ) : (
            <>
              <div className="absolute left-6 right-6 top-6 z-10 h-0.5 bg-gray-200 dark:bg-neutral-700" />
              <div
                className="absolute left-6 top-6 z-20 h-0.5 bg-blue-400 transition-all duration-500 ease-out dark:bg-blue-400"
                style={{ width: `calc(${currentStagePercentage}% - 8px)` }}
              />
            </>
          )}

          {ONBOARDING_STEPS.map((step, index) => {
            const isFinished = currentIndex > index
            const isCurrentStep = currentIndex === index

            return (
              <div
                key={step.link}
                className={cn(
                  'relative z-30 flex w-max flex-col items-center gap-3',
                  { 'flex-row gap-4': isVertical }
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                    'bg-white dark:bg-zinc-900',
                    {
                      'border-blue-400 text-blue-400': isCurrentStep,
                      'border-blue-400 bg-blue-400 text-white dark:bg-primary':
                        isFinished,
                      'border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500':
                        !isCurrentStep && !isFinished,
                    }
                  )}
                >
                  {isFinished ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                <div
                  className={cn('text-center transition-colors duration-300', {
                    'text-left': isVertical,
                  })}
                >
                  <p
                    className={cn(
                      'max-w-20 text-sm font-medium leading-tight transition-colors duration-300',
                      { 'max-w-none': isVertical },
                      {
                        'text-blue-400': isCurrentStep,
                        'text-gray-900 dark:text-gray-100': isFinished,
                        'text-gray-500 dark:text-gray-400':
                          !isCurrentStep && !isFinished,
                      }
                    )}
                  >
                    {step.name}
                  </p>

                  {isVertical && (
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      Step {index + 1} of {ONBOARDING_STEPS.length}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-400">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <span>{currentStagePercentage}% Complete</span>
          </div>
        </div>
      </div>

      <div
        className={cn('mx-auto w-full flex-1 lg:col-span-1', {
          'lg:col-span-3': isVertical,
        })}
      >
        {children}
      </div>
    </div>
  )
}
