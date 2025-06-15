'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/actions/account/get-auth-user'

export const getUserCategories = async () => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const defaultCategories = await prisma.category.findMany({
      where: {
        userId: null,
      },
    })

    const userCategories = await prisma.category.findMany({
      where: { userId: user.id },
    })

    const categories = [...defaultCategories, ...userCategories].map(
      (category) => ({
        ...category,
        label: category.name,
        value: category.id,
      })
    )

    return {
      items: categories,
      success: { message: 'User categories fetched successfully' },
    }
  } catch (error) {
    return {
      items: [],
      error: { message: 'Failed to fetch categories', details: error },
    }
  }
}
