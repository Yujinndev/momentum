'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Plus } from 'lucide-react'

type DialogFormWrapperProps = {
  title: string
  open: boolean
  setOpen: (value: boolean) => void
  children: React.ReactNode
  showTrigger?: boolean
  icon?: React.ReactNode
  className?: string
  contentContainerClassName?: string
}

export const DialogFormWrapper = ({
  title,
  open,
  setOpen,
  children,
  icon = <Plus />,
  showTrigger = true,
  className,
  contentContainerClassName,
}: DialogFormWrapperProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <div
          className={cn(
            'relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border bg-muted-foreground/10 py-4 text-center lg:w-40',
            className
          )}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-12 rounded-full"
            >
              {icon}
            </Button>
          </DialogTrigger>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
      )}

      <DialogContent
        className={cn(
          'max-h-[80vh] overflow-y-auto sm:max-w-md lg:max-w-screen-lg',
          contentContainerClassName
        )}
      >
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        {children}
      </DialogContent>
    </Dialog>
  )
}
