'use server'

import { prisma } from '@/lib/prisma'
import { Category } from '@/types/category'
import { getAuthUser } from '@/actions/account/get-auth-user'
import { getDefaultCategories } from '@/actions/finance/category/get-default-categories'

type CreateCategoryArgs = {
  values: Category
}

export const createCategory = async ({ values }: CreateCategoryArgs) => {
  try {
    const email = await getAuthUser()

    const user = await prisma.user.findFirstOrThrow({
      where: { email },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const defaultCategories = await getDefaultCategories()
    const checkIfInDefaultCategories = defaultCategories.categories?.some(
      (category) => category.name === values.name
    )

    if (checkIfInDefaultCategories) {
      throw new Error('Category already exists.')
    }

    const createdCategory = await prisma.category.create({
      data: values,
    })

    return {
      category: createdCategory,
      success: { message: 'Category created successfully' },
    }
  } catch (error) {
    console.log('Category creation error:', error)

    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }

    return {
      error: 'Failed to create category',
    }
  }
}
