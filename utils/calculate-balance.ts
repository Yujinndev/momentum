import { Transaction } from '@/types/transaction'
import { Decimal } from '@prisma/client/runtime/library'

type OperationArgs = {
  txType: Transaction['type']
  txAmount: number | Decimal
  currentBalance: number | Decimal
}

export const calculateBalance = ({
  txType,
  txAmount,
  currentBalance,
}: OperationArgs) => {
  if (txType === 'INCOME') {
    return Number(currentBalance) + Number(txAmount)
  }

  return Number(currentBalance) - Number(txAmount)
}
