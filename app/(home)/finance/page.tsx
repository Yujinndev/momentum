import { TransactionsTable } from '@/components/finance/transactions'
import { SectionLayout } from '@/components/layout/section-layout'

export default function Finance() {
  return (
    <SectionLayout>
      <div className="space-y-8">
        <TransactionsTable variant="FULL" />
      </div>
    </SectionLayout>
  )
}
