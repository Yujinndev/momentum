import { Prisma } from '@prisma/client'

export type BaseArgs = {
  prisma: Prisma.TransactionClient
  userId: string
  startDate: Date
  isRetainingProgress?: boolean
}
