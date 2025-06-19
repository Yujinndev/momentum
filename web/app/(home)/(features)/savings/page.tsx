import Link from 'next/link'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { Savings } from './list'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { SectionLayout } from '@/components/layout/section-layout'
import { getUserSavings } from '@/actions/savings/get-user-savings'

export default async function Page() {
  const savings = await getUserSavings()

  return (
    <div className="relative grid min-h-[80vh] w-full gap-4 xl:grid-cols-4">
      <div className="sticky top-8 h-max space-y-4 self-start">
        <div className="relative flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border bg-muted-foreground/10 py-4 text-center">
          <Button
            variant="outline"
            className="btn-primary group h-12 w-12 rounded-full"
            asChild
          >
            <Link href="/savings/new">
              <Plus className="group-hover:text-black" />
            </Link>
          </Button>

          <h3 className="text-sm font-semibold">Add New Goal</h3>
        </div>

        <SectionLayout className="min-h-52">
          <h3 className="mb-4 text-sm font-semibold">Saving Schedules:</h3>

          {savings.schedules.length > 0 ? (
            <div className="space-y-2">
              {savings.schedules.map((schedule, index) => (
                <Label
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50/70 p-3 has-[[aria-checked=true]]:border-zinc-600 has-[[aria-checked=true]]:bg-[#1c3052] dark:border-zinc-800 dark:bg-zinc-900/70 dark:has-[[aria-checked=true]]:border-blue-400 dark:has-[[aria-checked=true]]:bg-[#1c3052]"
                >
                  <Checkbox className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700" />
                  <div className="grid w-full gap-1.5 font-normal">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium leading-none">
                        Php {Number(schedule.amount)}
                      </p>
                      <p className="text-sm font-medium leading-none">
                        {schedule.goal.name}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(schedule.dueDate, 'PPp')}
                    </p>
                  </div>
                </Label>
              ))}
            </div>
          ) : (
            <div className="group flex items-center justify-center gap-3 rounded-lg p-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                No saving schedule found.
              </h3>
            </div>
          )}
        </SectionLayout>
      </div>

      <SectionLayout className="px-3 py-3 xl:col-span-3">
        <Savings items={savings.items} />
      </SectionLayout>
    </div>
  )
}
