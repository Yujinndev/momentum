'use client'

import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BentoCard } from './profile'

export default function Session() {
  const { data: session } = useSession()

  return (
    <div className="relative h-full w-full">
      {session && session.user && (
        <div className="flex flex-col gap-4">
          <Avatar className="h-80 w-full rounded-lg border bg-muted/50">
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
      )}
    </div>
  )
}
