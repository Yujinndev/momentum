import { Transaction } from '@/types/transaction'

export const getIconByTransactionType = (type: Transaction['type']) => {
  if (type === 'EXPENSE') {
    return '-'
  }

  return '+'
}
