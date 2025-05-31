'use client'

import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/toggle'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { logout } from '@/actions/account/auth.action'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const Header = () => {
  const { isMobile } = useSidebar()
  const { data: session } = useSession()

  return (
    <header className="fixed z-30 flex h-20 w-full shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-2 px-6">
        <div className="flex items-center">
          <SidebarTrigger
            size="lg"
            variant="ghost"
            className={cn('h-10 w-10 rounded-full p-2', {
              hidden: !isMobile,
            })}
          />

          <Brand showIcon={!isMobile} />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {session?.user && session?.user?.image && session?.user?.name && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-10 rounded-full border ring-1"
                >
                  <Avatar className="size-10">
                    {
                      <AvatarImage
                        src={session?.user?.image}
                        alt={session?.user?.name}
                      />
                    }
                    <AvatarFallback>
                      {session?.user?.name?.split(' ')[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={logout}>
                    <Button variant="destructive" className="w-full text-left">
                      Logout
                    </Button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
