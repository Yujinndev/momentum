'use client'

import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { WalletCard } from '@/components/features/wallet-card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { SectionLayout } from '@/components/layout/section-layout'
import { FormBackRedirect } from '@/components/ui/form-back-redirect'
import { Wallet, walletSchema, WalletWithId } from '@/types/wallet'
import { COLORSCHEMES, WALLET_TYPES } from '@/constants/choices'
import { createWallet } from '@/actions/wallet/create-wallet'
import { updateWallet } from '@/actions/wallet/update-wallet'
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

type WalletFormProps = {
  wallet?: WalletWithId
  onSubmitCallback?: () => void
  className?: string
  showBackButton?: boolean
}

export const WalletForm = ({
  wallet,
  onSubmitCallback,
  className,
  showBackButton = true,
}: WalletFormProps) => {
  const form = useForm<Wallet>({
    resolver: zodResolver(walletSchema),
    defaultValues: wallet ?? {
      name: '',
      description: '',
      balance: 0.0,
      type: 'CASH',
      color: 'BLACK',
      isDefault: false,
    },
  })

  const onSubmit = async (values: Wallet) => {
    const response = wallet
      ? await updateWallet({ id: wallet.id, values })
      : await createWallet({ values })

    if (response.error) {
      return toast({
        title: response.error.message,
        description: 'Please try again.',
      })
    }

    toast({
      title: response.success.message,
      description: 'You may view your updated wallet',
    })

    onSubmitCallback?.()
  }

  return (
    <div className={cn('relative mx-auto space-y-6 rounded-md', className)}>
      <FormBackRedirect
        title={wallet ? 'Update Wallet' : 'Add New Wallet'}
        description={
          wallet
            ? 'Synchronize updated details.'
            : 'Create a new wallet to organize your finances.'
        }
        isAllowBack={showBackButton}
        className="h-max"
      />

      <SectionLayout className="h-max">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid w-full gap-x-6 gap-y-4 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-2">
                <WalletCard wallet={form.watch()} />

                <div className="rounded-xl border bg-muted/50 px-4 py-3 pb-5">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <div className="flex w-full flex-wrap justify-between">
                            {COLORSCHEMES.map(({ value, primary }) => {
                              const isSelected = field.value === value

                              return (
                                <button
                                  type="button"
                                  key={value}
                                  onClick={() => field.onChange(value)}
                                  className={cn(
                                    'h-8 w-8 cursor-pointer rounded-full',
                                    'ring-1 ring-muted-foreground',
                                    { 'ring-2 ring-offset-2': isSelected },
                                    primary
                                  )}
                                />
                              )
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {wallet ? 'Running Balance' : 'Starting Balance'}
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput {...field} />
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
                            <SelectItem
                              key={currency.value}
                              value={currency.value}
                            >
                              <div className="flex cursor-pointer items-center gap-4">
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
                          Mark this wallet as your default for transactions and
                          budget tracking. You can change this anytime in your
                          wallet settings.
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
                  className="btn-primary w-full"
                  isLoading={form.formState.isSubmitting}
                >
                  {wallet ? 'Save update' : 'Save new wallet'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SectionLayout>
    </div>
  )
}
