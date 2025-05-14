'use server'

import { prisma } from '@/lib/prisma'

export const getDefaultCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: null,
      },
    })

    return {
      categories,
      success: { message: 'Default categories fetched successfully' },
    }
  } catch (error) {
    return { error: 'Failed to fetch default categories', details: error }
  }
}
