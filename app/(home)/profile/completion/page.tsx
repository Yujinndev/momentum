'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FinancialProfile,
  financialProfileSchema,
} from '@/actions/account/schema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CURRENCIES } from '@/constants/choices'
import { SectionLayout } from '@/components/layout/section-layout'
import { createFinancialProfile } from '@/actions/account/create-financial-profile'
import {
  Form,
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

export default function Page() {
  const router = useRouter()

  const form = useForm<FinancialProfile>({
    resolver: zodResolver(financialProfileSchema),
    defaultValues: {
      name: '',
      description: '',
      currency: 'PHP',
    },
  })

  async function onSubmit(values: FinancialProfile) {
    const response = await createFinancialProfile(values)

    if (response.error) {
      return form.setError('root', { message: response.error })
    }

    router.push('/dashboard')
  }

  return (
    <SectionLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-1/2 space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dream Chaser" {...field} />
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
                  <Input placeholder="Save and achieve it!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        <div className="flex items-center gap-4">
                          <currency.icon size={14} /> —{' '}
                          <span>{currency.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormMessage />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </SectionLayout>
  )
}
