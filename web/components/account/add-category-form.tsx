'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { COLORSCHEMES } from '@/constants/choices'
import { Category, categorySchema } from '@/types/category'
import { createCategory } from '@/actions/category/create-category'

type AddCategoryFormProps = {
  onSubmitCallback: () => void
}

export const AddCategoryForm = ({ onSubmitCallback }: AddCategoryFormProps) => {
  const form = useForm<Category>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: 'BLACK',
    },
  })

  const onSubmit = async (values: Category) => {
    const response = await createCategory({ values })

    if (response.error) {
      return form.setError('root', { message: response.error.message })
    }

    onSubmitCallback()
  }

  return (
    <div className="relative w-full space-y-3 py-2">
      <div className="py-2">
        <h2 className="text-lg font-bold">Add Custom Category</h2>
        <p className="text-sm">
          Create a new category to organize your transactions.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Eating Out" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used to describe your transactions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-xl border bg-muted/50 px-6 py-3 pb-5">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex w-full justify-between">
                      {COLORSCHEMES.map((color) => (
                        <div
                          key={color.value}
                          className={cn(`h-8 w-8 rounded-full`, color.primary, {
                            'ring-2 ring-black ring-offset-2':
                              field.value === color.value,
                          })}
                          onClick={() => field.onChange(color.value)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.formState.errors.root && (
            <div className="text-red-500">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
