import { cn } from '@/lib/utils'

export const SectionLayout = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <section
      className={cn(
        'relative mx-auto max-w-screen-2xl px-4 py-8 pr-6',
        className
      )}
    >
      {children}
    </section>
  )
}
