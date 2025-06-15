import { SectionLayout } from '@/components/layout/section-layout'
import { Savings } from './list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'

export default async function Page() {
  return (
    <div className="relative grid min-h-[80vh] w-full gap-4 xl:grid-cols-4">
      <div className="sticky top-8 h-max space-y-4 self-start">
        <div className="relative flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border bg-muted-foreground/10 py-4 text-center">
          <Button
            variant="outline"
            className="btn-primary group h-12 w-12 rounded-full"
            asChild
          >
            <Link href="">
              <Plus className="group-hover:text-black" />
            </Link>
          </Button>

          <h3 className="text-sm font-semibold">Add New Goal</h3>
        </div>

        <SectionLayout className="min-h-52">
          <h3 className="mb-4 text-sm font-semibold">Saving Schedules:</h3>

          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Label
                key={index}
                className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50/70 p-3 has-[[aria-checked=true]]:border-zinc-600 has-[[aria-checked=true]]:bg-[#1c3052] dark:border-zinc-800 dark:bg-zinc-900/70 dark:has-[[aria-checked=true]]:border-blue-400 dark:has-[[aria-checked=true]]:bg-[#1c3052]"
              >
                <Checkbox className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700" />
                <div className="grid w-full gap-1.5 font-normal">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium leading-none">
                      Php 1,000
                    </p>
                    <p className="text-sm font-medium leading-none">
                      Goal #{index + 1}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), 'PPp')}
                  </p>
                </div>
              </Label>
            ))}
          </div>
        </SectionLayout>
      </div>

      <SectionLayout className="px-3 py-3 xl:col-span-3">
        <Savings />
      </SectionLayout>
    </div>
  )
}
