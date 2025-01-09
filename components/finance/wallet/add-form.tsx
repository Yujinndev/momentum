'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Wallet, walletSchema } from '@/types/wallet'

import {
  Form,
  FormControl,
  FormDescription,
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
import { WalletCard } from './card'
import { Checkbox } from '@/components/ui/checkbox'
import { validateNumber } from '@/utils/validate-number'
import { COLORSCHEMES, WALLET_TYPES } from '@/constants/choices'
import { createWallet } from '@/actions/finance/wallet/create-wallet'

interface IAddWalletForm {
  onSubmitCallback: () => void
}

export const AddWalletForm = ({ onSubmitCallback }: IAddWalletForm) => {
  const form = useForm<Wallet>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: '',
      description: '',
      balance: 0.0,
      type: 'CASH',
      color: 'BLACK',
      isDefault: false,
    },
  })

  const onSubmit = async (values: Wallet) => {
    const response = await createWallet({ values })

    if (response.error) {
      return form.setError('root', { message: response.error })
    }

    onSubmitCallback()
  }

  return (
    <div className="relative w-full space-y-3 py-2">
      <div className="py-2">
        <h2 className="text-lg font-bold">Add Wallet</h2>
        <p className="text-sm">
          Create a new wallet to organize your finances.
        </p>
      </div>

      <WalletCard details={form.watch()} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Input placeholder="For daily usage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Balance</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = validateNumber(e.target.value)
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
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
                    {WALLET_TYPES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        <div className="flex items-center gap-4">
                          <currency.icon size={20} /> —{' '}
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

          <FormField
            control={form.control}
            name="isDefault"
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
                    Mark this wallet as your default for transactions and budget
                    tracking. You can change this anytime in your wallet
                    settings.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

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
