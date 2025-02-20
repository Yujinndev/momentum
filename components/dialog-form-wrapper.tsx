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
  open: boolean
  setOpen: (value: boolean) => void
  title: string
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export const DialogFormWrapper = ({
  open,
  setOpen,
  title,
  icon = <Plus />,
  className,
  children,
}: DialogFormWrapperProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          'flex aspect-video h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border bg-muted-foreground/10 text-center lg:h-40 lg:w-20',
          className
        )}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="h-12 w-12 rounded-full">
            {icon}
          </Button>
        </DialogTrigger>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md lg:max-w-screen-lg">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        {children}
      </DialogContent>
    </Dialog>
  )
}
