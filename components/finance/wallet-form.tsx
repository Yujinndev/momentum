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
import { FORM_DETAILS } from '@/constants/config'
import { Checkbox } from '@/components/ui/checkbox'
import { WalletCard } from '@/components/finance/wallet-card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { COLORSCHEMES, WALLET_TYPES } from '@/constants/choices'
import { useWalletMutation } from '@/data/mutations/wallet-mutation'

type AddWalletFormProps = {
  wallet?: Wallet
  onSubmitCallback?: () => void
}

export const WalletForm = ({
  onSubmitCallback,
  wallet,
}: AddWalletFormProps) => {
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

  const { mutateAsync, isPending } = useWalletMutation()

  const handleMutation = async (
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    values: Wallet
  ) => {
    try {
      await mutateAsync({ type, values })

      form.reset()
    } catch (error: any) {
      form.setError('root', { message: error.message })
    }
  }

  const onSubmit = async (values: Wallet) => {
    await handleMutation(wallet ? 'UPDATE' : 'CREATE', values)
    onSubmitCallback?.()
  }

  const handleOnDelete = async () => {
    if (!wallet) return

    await handleMutation('DELETE', wallet)
  }

  const FORM_DETAIL = wallet
    ? FORM_DETAILS.wallet.update
    : FORM_DETAILS.wallet.create

  return (
    <div className="relative space-y-3 py-2">
      <div className="py-2">
        <h2 className="text-lg font-bold">{FORM_DETAIL.title}</h2>
        <p className="text-sm">{FORM_DETAIL.description}</p>
      </div>

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
                          {COLORSCHEMES.map((color) => (
                            <div
                              key={color.value}
                              className={cn(
                                `h-8 w-8 cursor-pointer rounded-full`,
                                color.primary,
                                {
                                  'ring-2 ring-black ring-offset-2':
                                    field.value === color.value,
                                }
                              )}
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

              <div className="flex items-center justify-between gap-4">
                {wallet && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOnDelete}
                    className="w-full border-destructive"
                    disabled={isPending}
                  >
                    {isPending && !form.formState.isSubmitting
                      ? 'Removing Wallet...'
                      : 'Remove Wallet'}
                  </Button>
                )}

                <Button type="submit" className="w-full" disabled={isPending}>
                  {form.formState.isSubmitting
                    ? FORM_DETAIL.cta.pending
                    : FORM_DETAIL.cta.default}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
