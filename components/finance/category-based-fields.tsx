import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Choice } from '@/types/choices'
import { Input } from '@/components/ui/input'
import { INITIAL_BUDGETS } from '@/constants/choices'
import { useFieldArray, useFormContext } from 'react-hook-form'
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
import { Button } from '@/components/ui/button'

type CategoryBasedFieldsProps = {
  categories?: Choice<number>[]
  selectedCategories: Choice<number>['value'][]
  onSelectCategory: (category: number) => void
}

export const CategoryBasedFields = memo(
  ({
    categories,
    selectedCategories,
    onSelectCategory,
  }: CategoryBasedFieldsProps) => {
    const { control } = useFormContext()
    const { fields, append } = useFieldArray({
      control,
      name: 'budgets',
      shouldUnregister: true,
    })

    const handleAddBudgets = () => {
      append(INITIAL_BUDGETS['CategoryBased'])
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 flex-wrap gap-4">
          {fields.map((field, index) => {
            return (
              <SectionLayout
                key={field.id}
                className="space-y-4 overflow-hidden rounded-xl bg-black/40 p-0 shadow-sm backdrop-blur-xl"
              >
                <FormField
                  key={`budgets.${index}.name`}
                  name={`budgets.${index}.name`}
                  render={({ field }) => (
                    <FormItem className={cn('w-full bg-zinc-700 p-4')}>
                      <FormLabel>Name</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Food"
                          className="border-0 px-2 pb-1 text-white placeholder:text-base md:text-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 p-4 pt-0">
                  <FormField
                    key={`budgets.${index}.totalAmount`}
                    name={`budgets.${index}.totalAmount`}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <CurrencyInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />

                  {categories && categories.length > 0 && (
                    <FormField
                      key={`budgets.${index}.categories`}
                      name={`budgets.${index}.categories`}
                      render={({ field }) => {
                        const selectedValues: number[] = field.value

                        return (
                          <FormItem className="flex w-full flex-col">
                            <FormLabel>Categories</FormLabel>

                            <FormControl>
                              <OptionSelect
                                variant="single"
                                choices={categories}
                                selected={selectedValues}
                                className="text-xs"
                                globalSelection={selectedCategories}
                                onSelectionChange={(category: any) => {
                                  onSelectCategory(category)
                                  field.onChange(category)
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
        <Button type="button" onClick={handleAddBudgets}>
          ADD
        </Button>
      </div>
    )
  }
)
