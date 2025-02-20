'use client'

import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BentoCard } from '@/components/ui/bento-card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Session() {
  const { data: session } = useSession()

  if (!session || !session.user) return <Skeleton />

  return (
    <div className="relative flex h-full w-full flex-col gap-4">
      <Avatar className="h-48 w-full rounded-lg border bg-muted/50 object-contain">
        <AvatarImage
          src={session.user.image!}
          alt={session.user.name!}
          className="rounded-lg"
        />
        <AvatarFallback className="rounded-lg">User</AvatarFallback>
      </Avatar>
      <BentoCard title="User">
        <div className="w-full space-y-2 px-4 leading-tight">
          <h1 className="truncate text-3xl font-semibold">
            {session.user.name}
          </h1>
          <p className="truncate text-base">{session.user.email}</p>
        </div>
      </BentoCard>
    </div>
  )
}
