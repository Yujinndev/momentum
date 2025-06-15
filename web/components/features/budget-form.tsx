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
import { SectionLayout } from '@/components/layout/section-layout'
import { CurrencyInput } from '@/components/ui/currency-input'
import { OptionSelect } from '@/components/ui/option-select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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
import { FormBackRedirect } from '@/components/ui/form-back-redirect'

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
    if (!budget) {
      return {
        totalAmount: 0,
        method: 'ThreeBucket' as const,
        buckets: INITIAL_BUDGETS['ThreeBucket'],
      }
    }

    const { method, items, totalAmount } = budget

    if (method === 'ThreeBucket') {
      return {
        method,
        totalAmount,
        recurringPeriod: items[0]?.recurringPeriod ?? 'NONE',
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
        budgets: items.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.categories?.[0] ?? -1,
          recurringPeriod: item.recurringPeriod ?? 'NONE',
          totalAmount: item.totalAmount,
          spent: item.spent,
        })),
      } satisfies CategoryBasedBudget
    }
  }, [budget])

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
    const response = budget
      ? await updateBudget({
          values,
          budgetPrefId: budget.budgetPrefId,
          isRetainingProgress,
        })
      : await createBudget({ values })

    if (response.error) {
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

              {budget && budget.method === method && (
                <Label
                  htmlFor="isRetainingProgress"
                  className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50/70 p-3 has-[[aria-checked=true]]:border-zinc-600 has-[[aria-checked=true]]:bg-[#1c3052] dark:border-zinc-800 dark:bg-zinc-900/70 dark:has-[[aria-checked=true]]:border-blue-400 dark:has-[[aria-checked=true]]:bg-[#1c3052]"
                >
                  <Checkbox
                    id="isRetainingProgress"
                    checked={isRetainingProgress}
                    onCheckedChange={(checked) =>
                      setIsRetainingProgress(!!checked)
                    }
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
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
