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
  const currenWalletBalance = Number(currentBalance)

  if (txType === 'TRANSFER') {
    return isSender
      ? currenWalletBalance - amount
      : currenWalletBalance + amount
  }

  if (txType === 'INCOME') {
    return currenWalletBalance + amount
  }

  return currenWalletBalance - amount
}
