'use client'

import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { SavingsGoal, savingsGoalSchema } from '@/types/saving'
import { isRecurringMethodSavingsGoal } from '@/utils/type-guards-schemas'
import { RECURRING_PERIODS, SAVINGS_METHODS } from '@/constants/choices'
import { createSavingsGoal } from '@/actions/savings/create-savings'
import { FormBackRedirect } from '@/components/ui/form-back-redirect'
import { SectionLayout } from '@/components/layout/section-layout'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { CurrencyInput } from '@/components/ui/currency-input'
import { OptionSelect } from '@/components/ui/option-select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

type SavingsGoalFormProps = {
  className?: string
}

export const SavingsGoalForm = ({ className }: SavingsGoalFormProps) => {
  const form = useForm<SavingsGoal>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      method: 'Recurring',
      name: '',
      description: '',
      targetAmount: 0,
      endDate: undefined,
      recurringPeriod: 'MONTHLY',
      amount: 0,
      autoCredit: true,
      timeFrame: 1,
    },
  })

  const onSubmit = async (values: SavingsGoal) => {
    if (isRecurringMethodSavingsGoal(values)) {
      const totalAmount = values.amount * values.timeFrame

      if (totalAmount !== values.targetAmount) {
        return form.setError('amount', {
          message: 'Total of Recurring deposits is not equal to target amount.',
        })
      }
    }
    const response = await createSavingsGoal({ values })

    if (response.error) {
      return form.setError('root', { message: response.error.message })
    }

    toast({
      title: response.success.message,
      description: 'You may view your updated goals.',
    })
  }

  const method = form.watch('method')
  const isRecurringMethod = method === 'Recurring'

  return (
    <div className={cn('relative mx-auto space-y-6 rounded-md', className)}>
      <FormBackRedirect
        title="Add Savings Goal"
        description="Create a new savings goal and start building towards it."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid w-full gap-x-6 gap-y-4 lg:grid-cols-5">
            <div className="h-full space-y-4 lg:col-span-2">
              <SectionLayout className="h-max">
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Method</FormLabel>
                      <FormControl>
                        <OptionSelect
                          variant="single"
                          className="relative h-max flex-1 rounded-md py-4"
                          contentContainerStyle="flex flex-col"
                          choices={SAVINGS_METHODS}
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

              {isRecurringMethod && (
                <SectionLayout className="h-max space-y-4">
                  <FormField
                    control={form.control}
                    name="recurringPeriod"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Recurring Period</FormLabel>
                        <FormControl>
                          <OptionSelect
                            variant="single"
                            className="relative h-full flex-1 rounded-md py-4"
                            contentContainerStyle="flex flex-col"
                            choices={RECURRING_PERIODS.slice(1)}
                            selected={field.value}
                            onSelectionChange={field.onChange}
                            hasAnimation={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="autoCredit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Auto Credit</FormLabel>
                          <FormDescription>
                            Turn this on to automatically add scheduled deposits
                            based on your selected frequency.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </SectionLayout>
              )}
            </div>

            <div className="h-max space-y-4 lg:col-span-3">
              <SectionLayout className="h-max space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Vacation 2026" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="For family members"
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Target Amount</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel>End Date/Target Date</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          {...field}
                          variant="date"
                          disabled={(date) => date < new Date('1900-01-01')}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be your projected end date of your goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SectionLayout>

              {isRecurringMethod && (
                <SectionLayout className="h-max">
                  <div className="grid gap-x-4 gap-y-6 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem className="w-full lg:col-span-2">
                          <FormLabel>Amount of each deposits</FormLabel>
                          <FormControl>
                            <CurrencyInput
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeFrame"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Count of recurring deposits</FormLabel>
                          <FormControl>
                            <CurrencyInput
                              {...field}
                              showIcon={false}
                              onChange={(e) => {
                                field.onChange(e)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </SectionLayout>
              )}

              <SectionLayout className="h-max">
                {form.formState.errors.root && (
                  <div className="text-red-500">
                    {form.formState.errors.root.message}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <Button
                    type="submit"
                    className="btn-primary w-full"
                    isLoading={form.formState.isSubmitting}
                  >
                    Save new savings goal
                  </Button>
                </div>
              </SectionLayout>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
