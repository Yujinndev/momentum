import {
  Control,
  FieldErrors,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChartPie, Edit, Plus, Trash } from 'lucide-react'
import { INITIAL_BUDGETS, RECURRING_PERIODS } from '@/constants/choices'
import { useBudgetForm } from '@/contexts/budget-form-context'
import { BudgetSetting, CategoryBasedBudget } from '@/types/budget'
import { DialogFormWrapper } from '@/components/dialog-form-wrapper'
import { CurrencyInput } from '@/components/ui/currency-input'
import { OptionSelect } from '@/components/ui/option-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type BudgetProps = {
  index: number
  control: Control<BudgetSetting>
  totalBudgetsLength: number
}

export const CategoryBasedFields = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState(-1)

  const { control } = useFormContext<BudgetSetting>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'budgets',
  })

  const handleEditBudget = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const editBtn = target.closest('[data-action="edit"]')
    const removeBtn = target.closest('[data-action="remove"]')

    if (editBtn) {
      const card = editBtn?.closest('.budget-card')
      const budgetIndex = card?.getAttribute('data-index')

      if (budgetIndex) {
        const index = Number(budgetIndex)

        setSelectedBudgetIndex(index)
        setDialogOpen(true)
      }
    } else if (removeBtn) {
      const card = removeBtn?.closest('.budget-card')
      const budgetIndex = card?.getAttribute('data-index')

      if (budgetIndex) {
        const index = Number(budgetIndex)

        remove(index)
      }
    }
  }

  const handleCloseDialog = () => {
    setSelectedBudgetIndex(-1)
    return setDialogOpen((prev) => !prev)
  }

  const handleAddBudgets = () => {
    append(INITIAL_BUDGETS['CategoryBased'])
  }

  return (
    <div className="space-y-4">
      <DialogFormWrapper
        title="Manage budget"
        open={dialogOpen}
        setOpen={handleCloseDialog}
        showTrigger={false}
        contentContainerClassName="max-w-md lg:max-w-md"
      >
        <BudgetEdit index={selectedBudgetIndex} control={control} />
      </DialogFormWrapper>

      <Button
        type="button"
        variant="outline"
        className="absolute right-5 top-4 w-max"
        onClick={handleAddBudgets}
      >
        <span>Add More</span>
        <Plus className="h-3.5 w-3.5" />
      </Button>

      <div className="grid gap-4 lg:grid-cols-3" onClick={handleEditBudget}>
        {fields.map((field, index) => (
          <BudgetPreview
            key={field.id}
            index={index}
            control={control}
            totalBudgetsLength={fields.length}
          />
        ))}
      </div>
    </div>
  )
}

const BudgetEdit = ({
  index,
  control,
}: Omit<BudgetProps, 'totalBudgetsLength'>) => {
  const { categories, selectedCategories, handleSelectCategory } =
    useBudgetForm()

  if (index === -1) return null

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`budgets.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`budgets.${index}.totalAmount`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <CurrencyInput {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`budgets.${index}.recurringPeriod`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recurring Period</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a recurring period" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {RECURRING_PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`budgets.${index}.categories`}
        render={({ field }) => {
          const selectedValue: number = field.value

          return (
            <FormItem className="w-full">
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <OptionSelect
                  variant="single"
                  choices={categories}
                  selected={selectedValue}
                  globalSelection={selectedCategories}
                  onSelectionChange={(newSelected: any) => {
                    handleSelectCategory(newSelected)
                    field.onChange(newSelected)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  )
}

const BudgetPreview = ({ control, index, totalBudgetsLength }: BudgetProps) => {
  const { categories } = useBudgetForm()
  const { formState } = useFormContext()

  const budgets = useWatch({
    control,
    name: `budgets.${index}`,
  })

  const errors = formState.errors as FieldErrors<CategoryBasedBudget>
  const hasError =
    errors?.budgets?.[index]?.name?.message ||
    errors?.budgets?.[index]?.totalAmount?.message ||
    errors?.budgets?.[index]?.categories?.message

  return (
    <div
      data-index={index}
      className={cn(
        'budget-card group relative',
        'space-y-2 rounded-lg border p-3',
        'transition-all duration-200',
        {
          'border-destructive dark:border-destructive/50': hasError,
          'border-zinc-200 dark:border-zinc-700': !hasError,
        }
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'rounded-lg p-1.5',
              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            )}
          >
            <ChartPie className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {budgets.name !== '' ? (
              <span>{budgets.name}</span>
            ) : (
              <span className="font-light text-zinc-400 dark:text-zinc-400">
                Unnamed
              </span>
            )}{' '}
            {budgets.recurringPeriod && (
              <span className="rounded-full border px-2 py-1 font-light text-zinc-400 dark:text-zinc-400">
                {budgets.recurringPeriod}
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            data-action="edit"
            className="px-2 py-1"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          {totalBudgetsLength > 1 && (
            <Button
              type="button"
              variant="ghost"
              data-action="remove"
              className="px-2 py-1"
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <CurrencyInput value={budgets.totalAmount} disabled />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories
          .filter((category) => budgets.categories === category.value)
          .map((item) => (
            <div
              key={item.value}
              className={cn(
                'rounded-sm px-2 py-0.5 text-sm font-medium capitalize',
                'text-emerald-600 dark:text-emerald-400',
                'bg-emerald-100 dark:bg-emerald-900/30'
              )}
            >
              <p>{item.label}</p>
            </div>
          ))}
      </div>
    </div>
  )
}
