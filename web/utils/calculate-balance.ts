import { Transaction } from '@/types/transaction'
import { Decimal } from '@prisma/client/runtime/library'

export const calculateBalance = ({
  txType,
  txAmount,
  currentBalance,
  isSender = false,
}: {
  txType: Transaction['type']
  txAmount: number
  currentBalance: number | Decimal
  isSender?: boolean
}) => {
  const amount = Number(txAmount)
  const currentWalletBalance = Number(currentBalance)

  if (txType === 'TRANSFER') {
    return isSender
      ? currentWalletBalance - amount
      : currentWalletBalance + amount
  }

  if (txType === 'INCOME') {
    return currentWalletBalance + amount
  }

  return currentWalletBalance - amount
}
