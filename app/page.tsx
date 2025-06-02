import Link from 'next/link'
import Image from 'next/image'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/toggle'
import consistency from '@/public/images/consistency.png'

export default function Home() {
  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-background p-2">
      <div className="flex min-w-[50%] flex-1 flex-col items-center justify-center gap-12 px-8 py-6 text-foreground">
        <div className="absolute left-8 top-8">
          <ThemeToggle />
        </div>

        <Brand className="w-5/6 max-w-sm justify-center border-0 text-3xl" />

        <div className="mx-auto w-5/6 max-w-sm space-y-8 text-center">
          <p className="text-center text-base font-thin text-foreground">
            Momentum is your all-in-one app for managing finances, tracking
            habits, and achieving life goals. Gain clarity, build better habits,
            and take charge of your personal and financial growth with Momentum.
          </p>
          <Button size="lg" className="btn-primary w-full" asChild>
            <Link href="/auth/signin">Start stepping up!</Link>
          </Button>
        </div>
      </div>

      <Image
        src={consistency}
        alt="logo"
        width={400}
        height={1080}
        className="hidden flex-1 rounded-lg object-cover lg:block"
      />
    </div>
  )
}
