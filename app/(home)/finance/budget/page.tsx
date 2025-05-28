import { getUserCategories } from '@/actions/finance/category/get-user-categories'
import { BudgetSettingForm } from '@/components/finance/budget-form'
import { BudgetFormProvider } from '@/contexts/budget-form-context'

export default async function Page() {
  const categories = await getUserCategories()

  return (
    <BudgetFormProvider categories={categories.items}>
      <BudgetSettingForm />
    </BudgetFormProvider>
  )
}
