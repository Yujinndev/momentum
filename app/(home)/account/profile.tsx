'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useQuery } from '@tanstack/react-query'
import { COLORSCHEMES } from '@/constants/choices'
import { Skeleton } from '@/components/ui/skeleton'
import { FinanceStats } from '@/components/finance/stats'
import { DialogFormWrapper } from '@/components/dialog-form-wrapper'
import { AddCategoryForm } from '@/components/account/add-category-form'
import { getUserFinancialProfile } from '@/actions/account/get-user-financial-profile'

export default function Profile() {
  const [open, setOpen] = useState<boolean>(false)
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getUserFinancialProfile(),
  })

  if (!data?.profile || isLoading) return <Skeleton />

  const { profile } = data

  return (
    <div className="relative flex h-full gap-4">
      <div className="w-full space-y-4">
        <div className="rounded border bg-muted/50 px-4 py-8">
          <Breadcrumb className="pb-3">
            <BreadcrumbList>
              <BreadcrumbItem>Account</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Financial</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-4 h-px w-full bg-muted/70" />

          <div className="space-y-1">
            <h2 className="text-3xl font-semibold">{profile.name}</h2>
            <p className="text-muted-foreground">{profile?.description}</p>
          </div>
        </div>

        <FinanceStats />
      </div>

      <div className="h-full w-1/3">
        <BentoCard title="Custom Categories" className="w-max flex-col">
          <div className="grid grid-cols-2 gap-4 py-2">
            {profile.categories.length > 0 ? (
              profile.categories.map((category) => {
                const color = COLORSCHEMES.find(
                  (scheme) => scheme.value === category.color
                )

                return (
                  <div
                    key={category.id}
                    className={cn(
                      'rounded-full px-3 py-1 text-center',
                      color?.secondary,
                      color?.text
                    )}
                  >
                    <p className="text-sm">{category.name}</p>
                  </div>
                )
              })
            ) : (
              <p className="col-span-2 text-muted-foreground">
                No categories found
              </p>
            )}
          </div>

          <DialogFormWrapper
            open={open}
            setOpen={setOpen}
            title="Add Custom Category"
            className="bg-none lg:w-full"
          >
            <AddCategoryForm
              onSubmitCallback={() => setOpen(false)}
              profileId={profile.id}
            />
          </DialogFormWrapper>
        </BentoCard>
      </div>
    </div>
  )
}

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
