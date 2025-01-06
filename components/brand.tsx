import { cn } from '@/lib/utils'
import { Goal } from 'lucide-react'
import Link from 'next/link'

export const Brand = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 border-b border-white/10 p-2 pb-4 font-bold',
        className
      )}
    >
      <Goal className="size-6" />
      Momentum.
    </Link>
  )
}
