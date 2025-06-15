import { redirect } from 'next/navigation'
import { getUserBudgets } from '@/actions/budget/get-user-budgets'
import { getUserCategories } from '@/actions/category/get-user-categories'
import { BudgetSettingForm } from '@/components/features/budget-form'
import { BudgetFormProvider } from '@/contexts/budget-form-context'

export default async function Page() {
  const [categories, budgetPref] = await Promise.all([
    getUserCategories(),
    getUserBudgets(),
  ])

  if (budgetPref.error) {
    redirect('/budget')
  }

  const currentUserBudgetPreference = {
    items: budgetPref.items,
    totalAmount: budgetPref.totalAmount,
    method: budgetPref.method,
    budgetPrefId: budgetPref.budgetPreferenceId,
  }

  return (
    <BudgetFormProvider categories={categories.items}>
      <BudgetSettingForm budget={currentUserBudgetPreference} />
    </BudgetFormProvider>
  )
}
