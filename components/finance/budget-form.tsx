'use client'

import { useForm } from 'react-hook-form'
import { useCallback, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBudget } from '@/actions/finance/budget/create-budget'
import { completeUserOnboarding } from '@/actions/account/complete-onboarding'
import { useUserCategories } from '@/data/queries/get-user-categories'
import { BudgetSetting, budgetSettingSchema } from '@/types/budget'
import { CategoryBasedFields } from '@/components/finance/category-based-fields'
import { ThreeBucketFields } from '@/components/finance/three-buckets-fields'
import { toast } from '@/hooks/use-toast'
import { Choice } from '@/types/choices'
import {
  isCategoryBasedBudget,
  isThreeBucketBudget,
} from '@/utils/budget-helpers'
import { Button } from '@/components/ui/button'
import { SectionLayout } from '@/components/layout/section-layout'
import { CurrencyInput } from '@/components/ui/currency-input'
import { OptionSelect } from '@/components/ui/option-select'
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

type BudgetSettingFormProps = {
  onSubmitCallback: () => void
}

export const BudgetSettingForm = ({
  onSubmitCallback,
}: BudgetSettingFormProps) => {
  const { data } = useUserCategories()

  const categories = useMemo(() => {
    return data?.items?.map((category) => ({
      label: category.name,
      value: category.id,
    }))
  }, [data?.items])

  const [selectedCategories, setSelectedCategories] = useState<
    Choice<number>['value'][]
  >(THREE_BUCKET_CATEGORIES)

  const form = useForm<BudgetSetting>({
    resolver: zodResolver(budgetSettingSchema),
    shouldUnregister: true,
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      totalAmount: 0,
      method: 'ThreeBucket',
      recurringPeriod: 'MONTHLY',
      buckets: INITIAL_BUDGETS['ThreeBucket'],
    },
  })
  const { control, setValue, watch, reset, getValues } = form
  const isThreeBucketMethod = useMemo(
    () => watch('method') === 'ThreeBucket',
    [watch('method')]
  )

  const handleSelectCategory = (value: Choice<number>['value']) => {
    setSelectedCategories((prev) => {
      if (prev.includes(value)) {
        return prev.filter((selected) => selected !== value)
      }

      return [...prev, value]
    })
  }

  const onSubmit = async (values: BudgetSetting) => {
    const budget = await createBudget({ values })
    if (!budget.success) {
      toast({
        title: 'Unable to create budget',
        description: 'Please try again.',
      })

      return
    }

    await completeUserOnboarding()
    onSubmitCallback()
  }

  const onTotalAmountChange = (value: string) => {
    const newAmount = parseFloat(value)
    const formValues = watch()

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
    [reset, getValues]
  )

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full w-full flex-col gap-4"
        >
          <SectionLayout>
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
                      contentContainerStyle="flex-col lg:flex-row"
                      choices={BUDGET_METHODS}
                      selected={field.value}
                      onSelectionChange={(value) => {
                        field.onChange(value)
                        handleBudgetMethodChange(
                          value as BudgetSetting['method']
                        )
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionLayout>

          {isThreeBucketMethod && (
            <SectionLayout>
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
          )}

          <SectionLayout className="flex flex-col gap-3">
            <FormLabel>Budgets</FormLabel>

            {isThreeBucketMethod ? (
              <ThreeBucketFields
                categories={categories ?? []}
                selectedCategories={selectedCategories}
                onSelectCategory={handleSelectCategory}
              />
            ) : (
              <CategoryBasedFields
                categories={categories ?? []}
                selectedCategories={selectedCategories}
                onSelectCategory={handleSelectCategory}
              />
            )}
          </SectionLayout>

          <SectionLayout>
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
                      contentContainerStyle="flex-col lg:flex-row"
                      choices={RECURRING_PERIODS}
                      selected={field.value}
                      onSelectionChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionLayout>

          <Button>Submit</Button>
        </form>
      </Form>
    </div>
  )
}
