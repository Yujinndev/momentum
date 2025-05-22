'use client'

import { cn } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from './header'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { WalletCell } from '@/components/finance/transactions/wallet-cell'
import { getIconByTransactionType } from '@/utils/get-icon-by-transaction-type'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryCell } from './category-cell'
import { DetailedTransaction } from '@/types/transaction'
import { formatTransactionDate } from '@/utils/date'

export const transaction: ColumnDef<DetailedTransaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },

  {
    accessorKey: 'categoryId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const { categoryId, type } = row.original
      return <CategoryCell categoryId={categoryId} type={type} />
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const { transactionDate, description } = row.original
      const date = new Date(transactionDate)

      return (
        <div className="flex flex-col space-y-px py-4">
          <p>{description}</p>
          <span className="text-xs text-muted-foreground">
            {formatTransactionDate(date)}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'walletId',
    header: ({ column }) => (
      <div className="flex w-full items-center justify-center">
        <DataTableColumnHeader column={column} title="Wallet" />
      </div>
    ),
    cell: ({ row }) => {
      const walletId: string = row.getValue('walletId')
      return (
        <div className="flex w-full items-center justify-center">
          <WalletCell walletId={walletId} />
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <div className="flex w-full items-center justify-end">
        <DataTableColumnHeader column={column} title="Amount" />
      </div>
    ),
    cell: ({ row }) => {
      const { amount, walletRunningBalance } = row.original

      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'Php',
      }).format(amount)

      const formattedRunningBalance = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'Php',
      }).format(walletRunningBalance)

      const type = row.original.type
      const icon = getIconByTransactionType(type)

      return (
        <div className="space-y-2 text-right">
          <div
            className={cn('font-medium text-green-600 dark:text-green-400', {
              'text-red-600 dark:text-red-400': type === 'EXPENSE',
            })}
          >
            {icon} {formattedAmount}
          </div>

          <small className="font-light text-muted-foreground">
            {formattedRunningBalance}
          </small>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {}}>
              Copy transaction ID {transaction.id}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View transaction</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
