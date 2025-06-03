'use server'

import { prisma } from '@/lib/prisma'
import { Category } from '@/types/category'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { getDefaultCategories } from '@/actions/finance/category/get-default-categories'

type CreateCategoryArgs = {
  values: Category
}

export const createCategory = async ({ values }: CreateCategoryArgs) => {
  const { user } = await getAuthUser()

  try {
    if (!user) {
      throw new Error('No user found.')
    }

    const defaultCategories = await getDefaultCategories()
    const checkIfInDefaultCategories = defaultCategories.categories?.some(
      (category) => category.name === values.name
    )

    if (checkIfInDefaultCategories) {
      throw new Error('Category already exists.')
    }

    const createdCategory = await prisma.category.create({
      data: {
        ...values,
        user: {
          connect: { id: user.id },
        },
      },
    })

    return {
      category: createdCategory,
      success: { message: 'Category created successfully' },
    }
  } catch (error) {
    return {
      error: { message: 'Failed to create category', details: error },
    }
  }
}
