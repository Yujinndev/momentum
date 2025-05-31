import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative h-full w-full animate-pulse p-6',
        'bg-zinc-200/70 dark:bg-zinc-700/70',
        'border border-zinc-100 dark:border-zinc-800',
        'rounded-xl shadow-sm backdrop-blur-xl',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
