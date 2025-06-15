import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Goal } from 'lucide-react'

type BrandProps = {
  className?: string
  showIcon?: boolean
}

export const Brand = ({ className, showIcon = true }: BrandProps) => {
  return (
    <div className={cn('flex w-full', className)}>
      <Link
        href="/"
        className="flex w-full items-center justify-center gap-4 font-bold"
      >
        {showIcon && <Goal className="size-5" />}
        momentum.
      </Link>
    </div>
  )
}
