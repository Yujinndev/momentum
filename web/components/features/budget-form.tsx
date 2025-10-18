'use client'

import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormContext } from 'react-hook-form'
import { useBudgetForm } from '@/contexts/budget-form-context'
import { createBudget } from '@/actions/budget/create-budget'
import { updateBudget } from '@/actions/budget/update-budget'
import { CategoryBasedFields } from '@/components/features/category-based-fields'
import { ThreeBucketFields } from '@/components/features/three-buckets-fields'
import {
  BudgetSetting,
  budgetSettingSchema,
  CategoryBasedBudget,
  DetailedBudget,
  ThreeBucketBudget,
} from '@/types/budget'
import { CurrencyInput } from '@/components/ui/currency-input'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { SectionLayout } from '@/components/layout/section-layout'
import { FormBackRedirect } from '@/components/ui/form-back-redirect'
import { OptionSelect } from '@/components/ui/option-select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  isCategoryBasedBudget,
  isThreeBucketBudget,
} from '@/utils/type-guards-schemas'
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
import { getRecurringPeriodDate } from '@/utils/date'
import { CheckedState } from '@radix-ui/react-checkbox'

type BudgetSettingFormProps = {
  budget?: {
    items: DetailedBudget[]
    method: BudgetMethod
    totalAmount: number
    budgetPrefId: number
  }
  showBackButton?: boolean
  onSubmitCallback?: () => void | Promise<void>
}

export const BudgetSettingForm = ({
  budget,
  showBackButton = true,
  onSubmitCallback,
}: BudgetSettingFormProps) => {
  const router = useRouter()
  const [isRetainingProgress, setIsRetainingProgress] = useState(false)

  const values = useMemo(() => {
    const endDate = getRecurringPeriodDate({
      startDate: new Date(),
      period: 'MONTHLY',
    })

    if (!budget) {
      return {
        totalAmount: 0,
        method: 'ThreeBucket' as const,
        buckets: INITIAL_BUDGETS['ThreeBucket'],
        timeConfig: {
          isRecurring: false,
          endDate,
        },
      } satisfies ThreeBucketBudget
    }

    const { method, items, totalAmount } = budget
    console.log(method)
    if (method === 'ThreeBucket') {
      const isRecurring = items[0].recurringPeriod !== null

      const timeConfig = isRecurring
        ? { isRecurring, recurringPeriod: items[0].recurringPeriod! }
        : { isRecurring, endDate }

      return {
        method,
        totalAmount,
        timeConfig,
        buckets: items.map((item) => ({
          id: item.id,
          name: item.name,
          percentage: item.percentage ?? 0,
          categories: item.categories ?? [],
          totalAmount: item.totalAmount,
          spent: item.spent,
        })),
      } satisfies ThreeBucketBudget
    } else {
      return {
        method,
        budgets: items.map((item) => {
          const isRecurring = item.recurringPeriod !== null

          const timeConfig = isRecurring
            ? { isRecurring, recurringPeriod: item.recurringPeriod! }
            : { isRecurring, endDate: item.endDate }

          return {
            id: item.id,
            name: item.name,
            category: item.categories?.[0] ?? -1,
            recurringPeriod: item.recurringPeriod ?? 'NONE',
            totalAmount: item.totalAmount,
            spent: item.spent,
            timeConfig,
          }
        }),
      } satisfies CategoryBasedBudget
    }
  }, [budget])

  const form = useForm<BudgetSetting>({
    resolver: zodResolver(budgetSettingSchema),
    mode: 'onChange',
    defaultValues: values,
  })
  const { control, setValue, watch, getValues, register } = form

  const method = watch('method')
  const isThreeBucketMethod = useMemo(() => method === 'ThreeBucket', [method])
  const isRecurring = watch('timeConfig.isRecurring')

  const onSubmit = async (values: BudgetSetting) => {
    const response = budget
      ? await updateBudget({
          values,
          budgetPrefId: budget.budgetPrefId,
          isRetainingProgress,
        })
      : await createBudget({ values })

    if (response.error) {
      console.log(response.error.details)
      return form.setError('root', { message: response.error.message })
    }

    toast({
      title: response.success.message,
      description: 'Redirecting...',
    })

    if (onSubmitCallback) {
      await onSubmitCallback()
    } else {
      router.push('/finance')
    }
  }

  const onTotalAmountChange = (value: ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(value)
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

  const onTimeConfigRecurringChange = (value: CheckedState) => {
    if (value) {
      setValue(
        'timeConfig',
        {
          isRecurring: true,
          recurringPeriod: 'MONTHLY',
        },
        { shouldValidate: true }
      )
    } else {
      setValue(
        'timeConfig',
        {
          isRecurring: false,
          endDate: watch('timeConfig.endDate'),
        },
        { shouldValidate: true }
      )
    }
  }

  return (
    <div className="space-y-4">
      <FormBackRedirect
        title="Manage Budgets"
        description="Track your spendings"
        isAllowBack={showBackButton}
      />

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
                <SectionLayout className="h-max min-h-36">
                  <FormField
                    control={control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            {...field}
                            className="h-full"
                            onChange={(e) => {
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

                <FormField
                  control={control}
                  name="timeConfig.isRecurring"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label htmlFor="isRecurring" className="form-label">
                        <Checkbox
                          id="isRecurring"
                          className="form-checkbox"
                          checked={field.value}
                          onCheckedChange={(value) => {
                            onTimeConfigRecurringChange(value)
                            return field.onChange(value)
                          }}
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm font-medium leading-none">
                            Make this a Recurring Budget?
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Enable this to automatically renew your budget based
                            on your chosen schedule. You can change or stop
                            recurrence anytime.
                          </p>
                        </div>
                      </Label>
                    </FormItem>
                  )}
                />

                <SectionLayout className="h-max">
                  {isRecurring ? (
                    <FormField
                      control={control}
                      name="timeConfig.recurringPeriod"
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
                  ) : (
                    <FormField
                      control={form.control}
                      name="timeConfig.endDate"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-1">
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <DateTimePicker
                              {...field}
                              disabled={(date) => date < new Date('1900-01-01')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
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

              {budget && budget.method === method && (
                <Label htmlFor="isRetainingProgress" className="form-label">
                  <Checkbox
                    id="isRetainingProgress"
                    className="form-checkbox"
                    checked={isRetainingProgress}
                    onCheckedChange={(checked) =>
                      setIsRetainingProgress(!!checked)
                    }
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm font-medium leading-none">
                      Retain Progress and Transactions?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can retain past activity like progress and
                      transactions any time
                    </p>
                  </div>
                </Label>
              )}
            </div>
          </div>

          {form.formState.errors.root && (
            <div className="text-red-500">
              {form.formState.errors.root.message}
            </div>
          )}

          <Button
            className="btn-primary ml-auto w-full lg:w-[calc(50%-.8rem)]"
            isLoading={form.formState.isSubmitting}
          >
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
