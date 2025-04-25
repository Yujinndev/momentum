'use server'

import { prisma } from '@/lib/prisma'
import { error } from 'console'

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
  } catch {
    console.log('Get default categories error:', error)
    return { error: 'Failed to fetch default categories' }
  }
}
