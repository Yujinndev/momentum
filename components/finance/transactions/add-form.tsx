'use client'

import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Transaction, transactionSchema } from '@/types/transaction'
import { Input } from '@/components/ui/input'
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
import { validateNumber } from '@/utils/validate-number'
import { DatetimePicker } from '@/components/ui/date-time-picker'
import { useQueries } from '@tanstack/react-query'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'
import { useRouter } from 'next/navigation'
import {
  COLORSCHEMES,
  TRANSACTION_TYPES,
  WALLET_TYPES,
} from '@/constants/choices'
import { cn } from '@/lib/utils'
import { WalletCard } from '@/components/finance/wallet/card'
import { createTransaction } from '@/actions/finance/transaction/create-transaction'
import { getUserCategories } from '@/actions/finance/category/get-user-categories'
import { useToast } from '@/hooks/use-toast'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function AddTransactionForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [{ data: wallets, isSuccess: isWalletsFetched }, { data: categories }] =
    useQueries({
      queries: [
        { queryKey: ['wallets'], queryFn: () => getUserWallets() },
        { queryKey: ['categories'], queryFn: () => getUserCategories() },
      ],
    })

  if (isWalletsFetched && !wallets?.items) {
    router.push('/dashboard')
  }

  const defaultWallet = wallets?.items?.find((item) => item.isDefault)?.id
  const form = useForm<Transaction>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      categoryId: undefined,
      amount: 0.0,
      type: 'EXPENSE',
      status: 'COMPLETED',
      walletId: defaultWallet,
      financialProfileId: wallets?.financialProfileId,
      budgetId: null,
      savingsGoalId: null,
      date: new Date(),
    },
  })

  const currentWallet = wallets?.items?.find(
    (wallet) => wallet.id === form.watch().walletId
  )

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
      return form.setError('root', {
        message: response.error,
      })
    }

    toast({
      title: response.success?.message,
      description: 'You can record your transactions again.',
    })

    form.reset()
  }

  return (
    <div className="mx-auto space-y-8 rounded-md border px-8 py-6 md:w-2/3 lg:w-3/5">
      {form.watch().walletId && currentWallet && (
        <WalletCard details={currentWallet} />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="walletId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a wallet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wallets?.items?.map((wallet) => {
                      const walletType = WALLET_TYPES.find(
                        (type) => type.value === wallet.type
                      )
                      const color = COLORSCHEMES.find(
                        (scheme) => scheme.value === wallet.color
                      )

                      return (
                        <SelectItem
                          key={wallet.id}
                          value={wallet.id}
                          className={cn(
                            `my-2 px-6 focus:${color?.accent} focus:opacity-70 focus:${color?.text}`,
                            color?.primary,
                            color?.text
                          )}
                        >
                          <div className={cn('flex items-center gap-4')}>
                            {walletType?.icon && <walletType.icon size={20} />}—{' '}
                            <span>{wallet.name}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.items?.map((category) => {
                      const color = COLORSCHEMES.find(
                        (scheme) => scheme.value === category.color
                      )

                      const id = category.id.toString()
                      return (
                        <SelectItem
                          key={id}
                          value={id}
                          className={cn(
                            `my-2 rounded-full px-6 focus:opacity-70 text-${color?.secondary.split('-')[1]}-${color?.secondary.split('-')[2]}`
                          )}
                        >
                          {category.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
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
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {TRANSACTION_TYPES.map((type) => (
                      <FormItem
                        key={type.value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={type.value} />
                        </FormControl>
                        <FormLabel className="flex items-center gap-3 font-normal">
                          <type.icon /> {type.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
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
            name="date"
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
