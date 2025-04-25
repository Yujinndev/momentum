'use server'

import { getAuthUser } from '@/actions/account/get-auth-user'
import { prisma } from '@/lib/prisma'

export const getUserCategories = async () => {
  try {
    const defaultCategories = await prisma.category.findMany({
      where: {
        userId: null,
      },
    })

    const email = await getAuthUser()
    const user = await prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        categories: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const categories = [...defaultCategories, ...user.categories]

    return {
      items: categories,
      success: { message: 'User categories fetched successfully' },
    }
  } catch (error) {
    console.log('Get user categories error:', error)

    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }

    return { error: 'Failed to get user categories' }
  }
}
