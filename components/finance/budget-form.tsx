'use client'

import { MoveLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormContext } from 'react-hook-form'
import { useBudgetForm } from '@/contexts/budget-form-context'
import { createBudget } from '@/actions/finance/budget/create-budget'
import { completeUserOnboarding } from '@/actions/account/complete-onboarding'
import { CategoryBasedFields } from '@/components/finance/category-based-fields'
import { ThreeBucketFields } from '@/components/finance/three-buckets-fields'
import {
  BudgetSetting,
  budgetSettingSchema,
  DetailedBudget,
} from '@/types/budget'
import { SectionLayout } from '@/components/layout/section-layout'
import { CurrencyInput } from '@/components/ui/currency-input'
import { OptionSelect } from '@/components/ui/option-select'
import { Button } from '@/components/ui/button'
import {
  isCategoryBasedBudget,
  isThreeBucketBudget,
} from '@/utils/budget-helpers'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  BUDGET_METHODS,
  INITIAL_BUDGETS,
  RECURRING_PERIODS,
  THREE_BUCKET_CATEGORIES,
} from '@/constants/choices'
import { cn } from '@/lib/utils'
import { BudgetMethod } from '@prisma/client'

type BudgetSettingFormProps = {
  budget?: {
    items: DetailedBudget[]
    method: BudgetMethod
    totalAmount: number
  }
  onSubmitCallback?: () => void
}

export const BudgetSettingForm = ({
  budget,
  onSubmitCallback,
}: BudgetSettingFormProps) => {
  const router = useRouter()

  const values = budget
    ? budget?.method === 'ThreeBucket'
      ? {
          buckets: budget?.items,
          method: budget?.method,
          totalAmount: budget.totalAmount,
          recurringPeriod: budget.items[0].recurringPeriod,
        }
      : { budgets: budget?.items, method: budget?.method }
    : {
        totalAmount: 0,
        method: 'ThreeBucket' as const,
        buckets: INITIAL_BUDGETS['ThreeBucket'],
      }

  const form = useForm<BudgetSetting>({
    resolver: zodResolver(budgetSettingSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: values,
  })
  const { control, setValue, watch, getValues } = form

  const method = watch('method')
  const isThreeBucketMethod = useMemo(() => method === 'ThreeBucket', [method])

  const onSubmit = async (values: BudgetSetting) => {
    const response = await createBudget({ values })
    if (response.error) {
      return toast({
        title: response.error.message,
        description: 'Please try again.',
      })
    }

    toast({
      title: response.success.message,
      description: 'Redirecting you to finance dashboard.',
    })

    await completeUserOnboarding()

    if (onSubmitCallback) {
      onSubmitCallback()
    } else {
      router.push('/finance')
    }
  }

  const onTotalAmountChange = (value: string) => {
    const newAmount = parseFloat(value)
    const formValues = getValues()

    if (isThreeBucketBudget(formValues)) {
      INITIAL_BUDGETS['ThreeBucket'].forEach((budget, index) => {
        const totalAmount =
          !value || newAmount === 0 ? 0 : (budget.percentage / 100) * newAmount

        setValue(`buckets.${index}.totalAmount`, totalAmount, {
          shouldValidate: true,
        })
      })
    }
  }

  return (
    <div className="space-y-4">
      <SectionLayout className="flex items-center gap-4">
        <Button
          variant="outline"
          className="h-14 w-14 rounded-full p-2"
          onClick={() => router.back()}
        >
          <MoveLeft className="!h-4 !w-4 lg:!h-6 lg:!w-6" />
        </Button>

        <div className="py-2">
          <h2 className="text-lg font-bold">Manage Budgets</h2>
          <p className="text-sm">Track your spendings</p>
        </div>
      </SectionLayout>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto grid max-w-screen-xl space-y-4"
        >
          <MethodSelection />

          <div
            className={cn('grid gap-4', {
              'lg:grid-cols-2': isThreeBucketMethod,
            })}
          >
            {isThreeBucketMethod && (
              <div className="flex flex-col gap-4">
                <SectionLayout className="h-max">
                  <FormField
                    control={control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            {...field}
                            onChange={(e: any) => {
                              field.onChange(e)
                              onTotalAmountChange(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionLayout>

                <SectionLayout className="h-full">
                  <FormField
                    control={control}
                    name="recurringPeriod"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Recurring Period</FormLabel>
                        <FormControl>
                          <OptionSelect
                            variant="single"
                            className="relative h-full flex-1 rounded-md py-4"
                            contentContainerStyle="flex flex-col"
                            choices={RECURRING_PERIODS}
                            selected={field.value}
                            onSelectionChange={field.onChange}
                            hasAnimation={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionLayout>
              </div>
            )}

            <div className="grid gap-4">
              <SectionLayout className="flex flex-col gap-3">
                <FormLabel>Budgets</FormLabel>

                {isThreeBucketMethod ? (
                  <ThreeBucketFields />
                ) : (
                  <CategoryBasedFields />
                )}
              </SectionLayout>
            </div>
          </div>

          <Button className="btn-primary ml-auto w-[calc(50%-.8rem)]">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

const MethodSelection = () => {
  const { setSelectedCategories } = useBudgetForm()
  const { control, reset, setValue, getValues } =
    useFormContext<BudgetSetting>()

  const handleBudgetMethodChange = useCallback(
    (newMethod: BudgetSetting['method']) => {
      const formValues = getValues()

      if (isThreeBucketBudget(formValues)) {
        const totalAmount = formValues.totalAmount ?? 0
        const updatedBuckets = INITIAL_BUDGETS['ThreeBucket'].map((budget) => {
          return {
            ...budget,
            totalAmount:
              totalAmount !== 0 ? (budget?.percentage / 100) * totalAmount : 0,
          }
        })

        reset({
          ...formValues,
          totalAmount,
          buckets: updatedBuckets,
        })
      } else if (isCategoryBasedBudget(formValues)) {
        reset({
          ...formValues,
          budgets: INITIAL_BUDGETS['CategoryBased'],
        })
      }

      setSelectedCategories(
        newMethod === 'CategoryBased' ? [] : THREE_BUCKET_CATEGORIES
      )

      setValue('method', newMethod)
    },
    [reset, getValues, setSelectedCategories, setValue]
  )

  return (
    <SectionLayout className="h-max">
      <FormField
        control={control}
        name="method"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Method</FormLabel>
            <FormControl>
              <OptionSelect
                variant="single"
                className="relative h-full flex-1 rounded-md py-4"
                choices={BUDGET_METHODS}
                selected={field.value}
                onSelectionChange={(value) => {
                  field.onChange(value)
                  handleBudgetMethodChange(value as BudgetSetting['method'])
                }}
                hasAnimation={false}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </SectionLayout>
  )
}
