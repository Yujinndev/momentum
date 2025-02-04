'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/account/auth.action'
import { LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NAVIGATIONS } from '@/constants/navigation'
import { ThemeToggle } from '@/components/theme/toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Brand>
          <ThemeToggle />
        </Brand>
      </SidebarHeader>

      <SidebarGroup className="px-0">
        <SidebarGroupContent>
          <Calendar className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[35px]" />
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>

          <SidebarMenu>
            {NAVIGATIONS.filter((nav) => nav.isVisible).map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  tooltip={item.name}
                  className={cn('hover:bg-accent', {
                    'bg-primary text-white hover:bg-primary/80 hover:text-gray-100':
                      pathname.startsWith(item.url),
                  })}
                  asChild
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup className="space-y-1">
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          {session && session.user && (
            <div className="space-y-2 rounded-md bg-background/20 px-3 py-2">
              <div className="flex items-center gap-2 p-2 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session.user.image!}
                    alt={session.user.name!}
                  />
                  <AvatarFallback className="rounded-lg">User</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session.user.name}
                  </span>
                  <span className="truncate text-xs">{session.user.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/account">
                    <Settings className="text-foreground" />
                  </Link>
                </Button>
                <form action={logout} className="w-full">
                  <Button
                    variant="destructive"
                    className="w-full"
                    type="submit"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </Button>
                </form>
              </div>
            </div>
          )}
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
