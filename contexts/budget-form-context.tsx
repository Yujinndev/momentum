'use client'

import { createContext, useContext, useState } from 'react'
import { THREE_BUCKET_CATEGORIES } from '@/constants/choices'
import { Choice } from '@/types/choices'

type BudgetFormContextType = {
  categories: Choice<number>[]
  selectedCategories: number[]
  setSelectedCategories: (selected: number[]) => void
  handleSelectCategory: (value: number) => void
}

const BudgetFormContext = createContext<BudgetFormContextType | undefined>(
  undefined
)

export const BudgetFormProvider = ({
  children,
  categories,
}: {
  children: React.ReactNode
  categories: Choice<number>[]
}) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    THREE_BUCKET_CATEGORIES
  )

  const handleSelectCategory = (value: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(value)) {
        return prev.filter((selected) => selected !== value)
      }

      return [...prev, value]
    })
  }

  return (
    <BudgetFormContext.Provider
      value={{
        categories,
        selectedCategories,
        setSelectedCategories,
        handleSelectCategory,
      }}
    >
      {children}
    </BudgetFormContext.Provider>
  )
}

export const useBudgetForm = () => {
  const context = useContext(BudgetFormContext)

  if (!context) {
    throw new Error('useBudgetForm must be used within the BudgetFormProvider')
  }

  return context
}
