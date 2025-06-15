import { Prisma, PrismaClient } from '@prisma/client'
import { Transaction } from '@/types/transaction'

type HandleUpdateBudgetSpendingArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  values: Transaction
  userId: string
}

export const handleUpdateBudgetSpending = async ({
  prisma,
  userId,
  values: { categoryId, amount },
}: HandleUpdateBudgetSpendingArgs) => {
  const budgets = await prisma.budget.findMany({
    where: {
      userId,
      categories: { some: { id: categoryId } },
    },
  })

  const updates = budgets.map((budget) => {
    return prisma.budget.update({
      where: { id: budget.id },
      data: { spent: Number(budget.spent) + amount },
    })
  })

  await Promise.all(updates)
}
