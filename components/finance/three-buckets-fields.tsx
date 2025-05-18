import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Choice } from '@/types/choices'
import { Input } from '@/components/ui/input'
import { Home, Gift, Wallet } from 'lucide-react'
import { BudgetSetting, ThreeBucketBudget } from '@/types/budget'
import { FieldErrors, useFieldArray, useFormContext } from 'react-hook-form'
import { SectionLayout } from '@/components/layout/section-layout'
import { CurrencyInput } from '@/components/ui/currency-input'
import { OptionSelect } from '@/components/ui/option-select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

type ThreeBucketFieldsProps = {
  categories?: Choice<number>[]
  selectedCategories: Choice<number>['value'][]
  onSelectCategory: (category: number) => void
}

export const ThreeBucketFields = memo(
  ({
    categories,
    selectedCategories,
    onSelectCategory,
  }: ThreeBucketFieldsProps) => {
    const { control, formState } = useFormContext<BudgetSetting>()
    const { fields } = useFieldArray({
      control,
      name: 'buckets',
      shouldUnregister: true,
    })

    const error = () => {
      const errors = formState.errors as FieldErrors<ThreeBucketBudget>

      return (
        <p className="text-[0.8rem] font-medium text-destructive">
          {errors.buckets?.root?.message}
        </p>
      )
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          {fields.map((field, index) => {
            return (
              <SectionLayout
                key={field.id}
                className="space-y-2 overflow-hidden rounded-xl bg-black/40 p-0 shadow-sm backdrop-blur-xl"
              >
                <FormField
                  key={`buckets.${index}.name`}
                  name={`buckets.${index}.name`}
                  render={({ field }) => (
                    <FormItem className={cn('w-full bg-zinc-700 p-4')}>
                      <div className="flex items-center gap-1">
                        {field.value === 'Needs' && (
                          <Home className="size-5 text-blue-600 dark:text-blue-400" />
                        )}
                        {field.value === 'Wants' && (
                          <Gift className="size-5 text-purple-600 dark:text-purple-400" />
                        )}
                        {field.value === 'Savings' && (
                          <Wallet className="size-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                        <FormControl>
                          <Input
                            {...field}
                            className="border-0 px-2 pb-1 text-white md:text-xl"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2 p-4 pt-0">
                  <FormField
                    key={`buckets.${index}.percentage`}
                    name={`buckets.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Percentage</FormLabel>
                        <FormControl>
                          <CurrencyInput {...field} showIcon={false} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key={`buckets.${index}.totalAmount`}
                    name={`buckets.${index}.totalAmount`}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <CurrencyInput {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />

                  {categories && categories.length > 0 && (
                    <FormField
                      key={`buckets.${index}.categories`}
                      name={`buckets.${index}.categories`}
                      render={({ field }) => {
                        const selectedValues: number[] = field.value

                        return (
                          <FormItem className="w-full">
                            <FormLabel>Categories</FormLabel>
                            <FormControl>
                              <OptionSelect
                                variant="multi"
                                choices={categories}
                                selected={selectedValues}
                                globalSelection={selectedCategories}
                                onSelectionChange={(
                                  newSelected: any[],
                                  value: any
                                ) => {
                                  onSelectCategory(value)
                                  field.onChange(newSelected)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  )}
                </div>
              </SectionLayout>
            )
          })}
        </div>

        {error()}
      </div>
    )
  }
)
