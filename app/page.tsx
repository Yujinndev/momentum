import Link from 'next/link'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <div className="mx-auto flex w-3/5 items-center justify-between gap-8 border-b pb-8">
          <div className="w-full">
            <Brand className="w-full border-0 text-3xl" />
            <Button variant="secondary" className="px-6" asChild>
              <Link href="/auth/signin">Start stepping up!</Link>
            </Button>
          </div>
          <p className="text-right text-base font-thin text-muted-foreground">
            Momentum is your all-in-one app for managing finances, tracking
            habits, and achieving life goals. Gain clarity, build better habits,
            and take charge of your personal and financial growth with Momentum.
          </p>
        </div>
      </main>
    </div>
  )
}
