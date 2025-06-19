import { cn } from '@/lib/utils'

export const SectionLayout = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <section
      className={cn(
        'relative mx-auto h-full w-full max-w-screen-xl p-6 overflow-hidden',
        'bg-zinc-50/70 dark:bg-zinc-900/70',
        'border border-zinc-100 dark:border-zinc-800',
        'rounded-xl shadow-sm backdrop-blur-xl',
        className
      )}
    >
      {children}
    </section>
  )
}
