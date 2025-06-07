'use client'

import { useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Transaction, transactionSchema } from '@/types/transaction'
import { createTransaction } from '@/actions/transaction/create-transaction'
import {
  getWalletType,
  getColorScheme,
  getWalletById,
} from '@/utils/get-values-from-choices'
import { TRANSACTION_TYPES } from '@/constants/choices'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { WalletCard } from '@/components/features/wallet-card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { DatetimePicker } from '@/components/ui/date-time-picker'
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
import { SectionLayout } from '@/components/layout/section-layout'
import { OptionSelect } from '@/components/ui/option-select'
import { WalletWithId } from '@/types/wallet'
import { Category } from '@prisma/client'
import { FormBackRedirect } from '@/components/ui/form-back-redirect'

type AddTransactionFormProps = {
  wallets: WalletWithId[]
  categories: Category[]
  className?: string
}

export function AddTransactionForm({
  wallets,
  categories,
  className,
}: AddTransactionFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const selectedWallet = searchParams.get('wallet-id')

  const defaultWallet = selectedWallet
    ? selectedWallet
    : wallets.find((item) => item.isDefault)?.id

  const form = useForm<Transaction>({
    shouldUnregister: true,
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      categoryId: undefined,
      amount: 0.0,
      type: 'EXPENSE',
      walletId: defaultWallet,
      transactionDate: new Date(),
      budgetId: undefined,
    },
  })

  const walletId = form.watch('walletId')
  const currentWallet = useMemo(
    () => wallets && getWalletById(wallets, walletId),
    [walletId, wallets]
  )

  const receivingWalletId = form.watch('receivingWalletId')
  const receivingWallet = useMemo(
    () => getWalletById(wallets, receivingWalletId),
    [receivingWalletId, wallets]
  )

  useEffect(() => {
    const isSenderAndReceiverTheSame =
      receivingWalletId && receivingWalletId === walletId

    if (isSenderAndReceiverTheSame) {
      form.resetField('receivingWalletId', { keepDirty: true })
    }
  }, [walletId, receivingWalletId, form])

  const onSubmit = async (values: Transaction) => {
    if (!currentWallet) {
      return form.setError('walletId', {
        message: 'Please select a valid wallet',
      })
    }

    if (values.amount > currentWallet?.balance && values.type !== 'INCOME') {
      return form.setError('amount', {
        message: 'Selected wallet has not enough balance',
      })
    }

    const response = await createTransaction({ values })

    if (response.error) {
      return toast({
        title: response.error.message,
        description: 'Please try again',
      })
    }

    toast({
      title: response.success.message,
      description: 'You can record your transactions again.',
    })

    form.reset()
    router.refresh()
  }

  return (
    <div className={cn('relative mx-auto space-y-6 rounded-md', className)}>
      <FormBackRedirect
        title="Add New Transaction"
        description="Record your new transactions."
      />

      <SectionLayout>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid w-full gap-x-6 gap-y-4 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-2">
                {form.watch('walletId') && currentWallet && (
                  <WalletCard wallet={currentWallet} />
                )}

                <FormField
                  control={form.control}
                  name="walletId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Wallet</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a wallet" />
                          </SelectTrigger>

                          <SelectContent>
                            {wallets.map((wallet) => {
                              const type = getWalletType(wallet?.type)
                              const color = getColorScheme(wallet?.color)

                              return (
                                <SelectItem key={wallet.id} value={wallet.id}>
                                  <div
                                    className={cn(
                                      `flex items-center gap-4 text-${color.base}-400`
                                    )}
                                  >
                                    <type.icon size={20} /> —{' '}
                                    <span>{wallet.name}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('type') === 'TRANSFER' && (
                  <>
                    <FormField
                      control={form.control}
                      name="receivingWalletId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Receiving Wallet</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a recieving wallet" />
                              </SelectTrigger>

                              <SelectContent>
                                {wallets
                                  .filter(
                                    (item) => item.id !== form.watch('walletId')
                                  )
                                  .map((wallet) => {
                                    const type = getWalletType(wallet?.type)
                                    const color = getColorScheme(wallet?.color)

                                    return (
                                      <SelectItem
                                        key={wallet.id}
                                        value={wallet.id}
                                      >
                                        <div
                                          className={cn(
                                            `flex items-center gap-4 text-${color.base}-400`
                                          )}
                                        >
                                          <type.icon size={20} /> —{' '}
                                          <span>{wallet.name}</span>
                                        </div>
                                      </SelectItem>
                                    )
                                  })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('receivingWalletId') && receivingWallet && (
                      <WalletCard wallet={receivingWallet} />
                    )}
                  </>
                )}
              </div>

              <div className="space-y-4 lg:col-span-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Buy Foods" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>

                          <SelectContent>
                            {categories?.map((category) => {
                              const color = getColorScheme(category.color)
                              const id = category.id.toString()

                              return (
                                <SelectItem key={id} value={id}>
                                  <div className={`text-${color.base}-400`}>
                                    {category.name}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3 rounded border bg-muted/50 px-4 py-2 pb-4">
                      <FormLabel>Type of Transaction</FormLabel>
                      <FormControl>
                        <OptionSelect
                          variant="single"
                          selected={field.value}
                          onSelectionChange={field.onChange}
                          choices={TRANSACTION_TYPES}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <CurrencyInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Transaction</FormLabel>
                      <FormControl>
                        <DatetimePicker
                          className="w-full"
                          {...field}
                          format={[
                            ['months', 'days', 'years'],
                            ['hours', 'minutes', 'am/pm'],
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
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
                  Save transaction
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SectionLayout>
    </div>
  )
}
