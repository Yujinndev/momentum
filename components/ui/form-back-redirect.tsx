'use client'

import { MoveLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SectionLayout } from '@/components/layout/section-layout'
import { cn } from '@/lib/utils'

type FormBackRedirectProps = {
  title: string
  description: string
  className?: string
  isAllowBack?: boolean
}

export const FormBackRedirect = ({
  title,
  description,
  className,
  isAllowBack = true,
}: FormBackRedirectProps) => {
  const router = useRouter()

  return (
    <SectionLayout className={cn('flex items-center gap-4', className)}>
      {isAllowBack && (
        <Button
          variant="outline"
          className="h-14 w-14 rounded-full p-2"
          onClick={() => router.back()}
        >
          <MoveLeft className="!h-4 !w-4 lg:!h-6 lg:!w-6" />
        </Button>
      )}

      <div className="py-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </SectionLayout>
  )
}
