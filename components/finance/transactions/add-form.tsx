'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { MoveLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useQueries } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Transaction, transactionSchema } from '@/types/transaction'
import { getUserWallets } from '@/actions/finance/wallet/get-user-wallets'
import { getUserCategories } from '@/actions/finance/category/get-user-categories'
import { createTransaction } from '@/actions/finance/transaction/create-transaction'
import { getWalletType, getColorScheme } from '@/utils/get-values-from-choices'
import { validateNumber } from '@/utils/validate-number'
import { TRANSACTION_TYPES } from '@/constants/choices'
import { FORM_DETAILS } from '@/constants/config'

import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { WalletCard } from '@/components/finance/wallet/card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { DatetimePicker } from '@/components/ui/date-time-picker'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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

  const FORM_DETAIL = FORM_DETAILS.transaction.create

  return (
    <div className="m-auto space-y-8 rounded-md px-8 py-6 md:w-2/3 lg:w-4/5">
      <div className="flex items-center gap-4 rounded-xl border bg-muted/50 px-6 py-3 pb-5">
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full"
          onClick={() => router.back()}
        >
          <MoveLeft />
        </Button>
        <div className="py-2">
          <h2 className="text-lg font-bold">{FORM_DETAIL.title}</h2>
          <p className="text-sm">{FORM_DETAIL.description}</p>
        </div>
      </div>
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
                          const type = getWalletType(wallet?.type)
                          const color = getColorScheme(wallet?.color)

                          return (
                            <SelectItem key={wallet.id} value={wallet.id}>
                              <div
                                className={cn(
                                  `flex items-center gap-4 text-${color.base}-500`
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
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.items?.map((category) => {
                          const color = getColorScheme(category.color)
                          const id = category.id.toString()

                          return (
                            <SelectItem key={id} value={id}>
                              <div className={`text-${color.base}-500`}>
                                {category.name}
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
                      <CurrencyInput
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
                {form.formState.isSubmitting
                  ? FORM_DETAIL.cta.pending
                  : FORM_DETAIL.cta.default}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
