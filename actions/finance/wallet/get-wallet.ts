'use server'

import { prisma } from '@/lib/prisma'
import { Prisma, PrismaClient } from '@prisma/client'

type GetWalletArgs = {
  tx?: PrismaClient | Prisma.TransactionClient
  userId: string
  walletId: string
}

export const getWallet = async ({
  tx = prisma,
  userId,
  walletId,
}: GetWalletArgs) => {
  try {
    const wallet = await tx.wallet.findFirst({
      where: { userId: userId, id: walletId },
    })

    if (!wallet) {
      throw new Error('Wallet not found or unauthorized access')
    }

    return wallet
  } catch (error) {
    throw error
  }
}
