import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Goal } from 'lucide-react'

export const Brand = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn('flex w-full border-b border-white/10 p-2 pb-4', className)}
    >
      <Link href="/" className="flex w-full items-center gap-2 font-bold">
        <Goal className="size-6" />
        Momentum.
      </Link>
      {children}
    </div>
  )
}
