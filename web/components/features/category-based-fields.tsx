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
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

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
        <BudgetEdit index={selectedBudgetIndex} />
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
            totalBudgetsLength={fields.length}
          />
        ))}
      </div>
    </div>
  )
}

const BudgetEdit = ({
  index,
}: Omit<BudgetProps, 'totalBudgetsLength' | 'control'>) => {
  const { categories, selectedCategories, handleSelectCategory } =
    useBudgetForm()
  const { control, watch } = useFormContext<BudgetSetting>()

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
        name={`budgets.${index}.timeConfig.isRecurring`}
        render={({ field }) => (
          <FormItem className="w-full">
            <Label htmlFor="isRecurring" className="form-label">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="isRecurring"
                className="form-checkbox"
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm font-medium leading-none">
                  Make this a Recurring Budget?
                </p>
                <p className="text-sm text-muted-foreground">
                  Enable this to automatically renew your budget based on your
                  chosen schedule. You can change or stop recurrence anytime.
                </p>
              </div>
            </Label>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`budgets.${index}.timeConfig.recurringPeriod`}
        render={({ field }) => (
          <FormItem
            className={cn('hidden w-full', {
              block: watch(`budgets.${index}.timeConfig.isRecurring`),
            })}
          >
            <FormLabel>Recurring Period</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12">
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
        name={`budgets.${index}.timeConfig.endDate`}
        render={({ field }) => (
          <FormItem
            className={cn('flex w-full flex-col gap-1', {
              hidden: watch(`budgets.${index}.timeConfig.isRecurring`),
            })}
          >
            <FormLabel>End Date</FormLabel>
            <FormControl>
              <DateTimePicker
                {...field}
                value={field.value ?? new Date()}
                disabled={(date) => date < new Date('1900-01-01')}
                modal={true}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`budgets.${index}.category`}
        render={({ field }) => {
          const selectedValue = field.value === -1 ? undefined : field.value

          return (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
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

const BudgetPreview = ({
  index,
  totalBudgetsLength,
}: Omit<BudgetProps, 'control'>) => {
  const { categories } = useBudgetForm()
  const { control, formState } = useFormContext()

  const budgets = useWatch({
    control,
    name: `budgets.${index}`,
  })

  const errors = formState.errors as FieldErrors<CategoryBasedBudget>
  const hasError =
    errors?.budgets?.[index]?.name?.message ||
    errors?.budgets?.[index]?.totalAmount?.message ||
    errors?.budgets?.[index]?.category?.message

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
            {budgets.timeConfig.recurringPeriod && (
              <span className="rounded-full border px-2 py-1 font-light text-zinc-400 dark:text-zinc-400">
                {budgets.timeConfig.recurringPeriod}
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
          .filter((category) => budgets.category === category.value)
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
