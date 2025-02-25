import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

export const BentoCard = ({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div className="w-full rounded border bg-muted/50 p-4">
      <Breadcrumb className="pb-3">
        <BreadcrumbList>
          <BreadcrumbEllipsis />
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-4 h-px w-full bg-muted/70" />

      <div
        className={cn('flex items-center justify-center gap-y-4', className)}
      >
        {children}
      </div>
    </div>
  )
}
