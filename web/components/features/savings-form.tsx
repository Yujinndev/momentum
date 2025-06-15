'use client'

import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SectionLayout } from '@/components/layout/section-layout'
import { FormBackRedirect } from '@/components/ui/form-back-redirect'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SavingsGoal, savingsGoalSchema } from '@/types/saving'
import { createSavingsGoal } from '@/actions/savings/create-savings'

type SavingsGoalFormProps = {
  className?: string
}

export const SavingsGoalForm = ({ className }: SavingsGoalFormProps) => {
  const form = useForm<SavingsGoal>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {},
  })

  const onSubmit = async (values: SavingsGoal) => {
    const response = await createSavingsGoal({ values })

    if (response.error) {
      return form.setError('root', { message: response.error.message })
    }

    toast({
      title: response.success.message,
      description: 'You may view your updated wallet',
    })
  }

  return (
    <div className={cn('relative mx-auto space-y-6 rounded-md', className)}>
      <FormBackRedirect title="Add Savings" description="asfasf" />

      <SectionLayout className="h-max">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid w-full gap-x-6 gap-y-4 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="On hand" {...field} />
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
                        <Input
                          {...field}
                          placeholder="For daily usage"
                          value={field.value ?? ''}
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
                        <FormLabel>Set as Default Wallet</FormLabel>
                        <FormDescription>
                          Mark this wallet as your default for transactions and
                          budget tracking. You can change this anytime in your
                          wallet settings.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between gap-4">
                  {form.formState.errors.root && (
                    <div className="text-red-500">
                      {form.formState.errors.root.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="btn-primary w-full"
                    isLoading={form.formState.isSubmitting}
                  >
                    Save new savings goal
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </SectionLayout>
    </div>
  )
}
