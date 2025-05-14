import { Decimal } from '@prisma/client/runtime/library'

type OperationArgs = {
  txType: 'ADD' | 'DEDUCT'
  txAmount: number | Decimal
  currentBalance: number | Decimal
}

export const calculateBalance = ({
  txType,
  txAmount,
  currentBalance,
}: OperationArgs) => {
  if (txType === 'ADD') {
    return Number(currentBalance) + Number(txAmount)
  }

  return Number(currentBalance) - Number(txAmount)
}
