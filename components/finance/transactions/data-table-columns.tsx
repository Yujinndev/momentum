'use client'

import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-header'
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
import { TRANSACTION_TYPES } from '@/constants/choices'
import { Transaction } from '@/types/transaction'

export const displayColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))

      return (
        <span className="text-right text-xs font-medium">
          {format(date, 'PPp')}
        </span>
      )
    },
  },
  {
    accessorKey: 'walletId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wallet" />
    ),
    cell: ({ row }) => {
      const walletId: string = row.getValue('walletId')
      return <WalletCell walletId={walletId} />
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
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'Php',
      }).format(amount)

      const type = row.original.type
      const icon = getIconByTransactionType(type)

      return (
        <div
          className={cn(
            'text-right font-medium text-green-600 dark:text-green-400',
            {
              'text-red-600 dark:text-red-400': type === 'EXPENSE',
            }
          )}
        >
          {icon} {formatted}
        </div>
      )
    },
  },
]

export const allColumns: ColumnDef<Transaction>[] = [
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
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type')
      const txType = TRANSACTION_TYPES.find((txType) => txType.value === type)

      return (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full bg-green-400 font-medium text-black',
              {
                'bg-red-400': type === 'EXPENSE',
              }
            )}
          >
            {txType?.icon && <txType.icon size={12} />}
          </div>
          <span>{txType?.label}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'categoryId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const categoryId: number = row.getValue('categoryId')
      return <CategoryCell categoryId={categoryId} />
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))

      return (
        <span className="text-right text-xs font-medium">
          {format(date, 'PPp')}
        </span>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <div className="flex w-full items-center">
        <DataTableColumnHeader column={column} title="Amount" />
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'Php',
      }).format(amount)

      const type = row.original.type
      const icon = getIconByTransactionType(type)

      return (
        <div
          className={cn('font-medium text-green-600 dark:text-green-400', {
            'text-red-600 dark:text-red-400': type === 'EXPENSE',
          })}
        >
          {icon} {formatted}
        </div>
      )
    },
  },
  {
    accessorKey: 'walletId',
    header: ({ column }) => (
      <div className="flex w-full items-center justify-end">
        <DataTableColumnHeader column={column} title="Wallet" />
      </div>
    ),
    cell: ({ row }) => {
      const walletId: string = row.getValue('walletId')
      return (
        <div className="flex w-full items-center justify-end">
          <WalletCell walletId={walletId} />
        </div>
      )
    },
  },
  {
    accessorKey: 'walletRunningBalance',
    header: ({ column }) => (
      <div className="flex w-full items-center justify-end">
        <DataTableColumnHeader column={column} title="Running Balance" />
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('walletRunningBalance'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'Php',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
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
