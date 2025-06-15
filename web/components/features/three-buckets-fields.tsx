import {
  Control,
  useWatch,
  FieldErrors,
  FormState,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import { ChangeEvent, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChartPie, Edit } from 'lucide-react'
import { useBudgetForm } from '@/contexts/budget-form-context'
import { BudgetSetting, ThreeBucketBudget } from '@/types/budget'
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

type BucketProps = {
  index: number
  control: Control<BudgetSetting>
}

export const ThreeBucketFields = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState(-1)

  const { control, formState } = useFormContext<BudgetSetting>()
  const { fields } = useFieldArray({
    control,
    name: 'buckets',
  })

  const handleEditBudget = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const editBtn = target.closest('[data-action="edit"]')
    if (!editBtn) return

    const card = editBtn.closest('.budget-card')
    const budgetIndex = card?.getAttribute('data-index')

    if (budgetIndex) {
      const index = Number(budgetIndex)

      setSelectedBudgetIndex(index)
      setDialogOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setSelectedBudgetIndex(-1)
    return setDialogOpen((prev) => !prev)
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
        <BucketEdit index={selectedBudgetIndex} control={control} />
      </DialogFormWrapper>

      <div className="grid gap-4" onClick={handleEditBudget}>
        {fields.map((field, index) => (
          <BucketPreview key={field.id} control={control} index={index} />
        ))}
      </div>

      <BucketError formState={formState} />
    </div>
  )
}

const BucketError = ({
  formState,
}: {
  formState: FormState<BudgetSetting>
}) => {
  const errors = formState.errors as FieldErrors<ThreeBucketBudget>

  return (
    <p className="text-[0.8rem] font-medium text-destructive">
      {errors.buckets?.root?.message}
    </p>
  )
}

const BucketEdit = ({ index, control }: BucketProps) => {
  const { setValue, getValues } = useFormContext()
  const { categories, selectedCategories, handleSelectCategory } =
    useBudgetForm()

  if (index === -1) return null

  const onPercentageChange = (percentage: ChangeEvent<HTMLInputElement>) => {
    const overallAmount = getValues('totalAmount')
    const newBucketAmount = (Number(percentage) / 100) * overallAmount

    setValue(`buckets.${index}.totalAmount`, newBucketAmount)
  }

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`buckets.${index}.name`}
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
        name={`buckets.${index}.percentage`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Percentage</FormLabel>
            <FormControl>
              <CurrencyInput
                {...field}
                onChange={(e) => {
                  onPercentageChange(e)
                  field.onChange(e)
                }}
                showIcon={false}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`buckets.${index}.totalAmount`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <CurrencyInput {...field} readOnly />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
                  onSelectionChange={(newSelected: any[], value: any) => {
                    handleSelectCategory(value)
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

const BucketPreview = ({ control, index }: BucketProps) => {
  const { categories } = useBudgetForm()
  const { formState } = useFormContext()

  const bucket = useWatch({
    control,
    name: `buckets.${index}`,
  })

  const errors = formState.errors as FieldErrors<ThreeBucketBudget>
  const hasError =
    errors?.buckets?.[index]?.name?.message ||
    errors?.buckets?.[index]?.percentage?.message ||
    errors?.buckets?.[index]?.totalAmount?.message ||
    errors?.buckets?.[index]?.categories?.message

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
            {bucket.name !== '' ? (
              <span>{bucket.name}</span>
            ) : (
              <span className="font-light text-zinc-400 dark:text-zinc-400">
                Unnamed
              </span>
            )}{' '}
            <span className="font-light text-zinc-400 dark:text-zinc-400">
              ({bucket.percentage} %)
            </span>
          </h3>
        </div>

        <Button type="button" variant="ghost" data-action="edit">
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <CurrencyInput value={bucket.totalAmount} disabled />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories
          .filter((category) => bucket.categories.includes(category.value))
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
