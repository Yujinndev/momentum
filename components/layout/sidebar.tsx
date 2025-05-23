'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { LogOut, Settings } from 'lucide-react'
import { logout } from '@/actions/account/auth.action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NAVIGATIONS } from '@/constants/navigation'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Brand } from '@/components/brand'
import { cn } from '@/lib/utils'
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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import Header from './header'
import { format } from 'date-fns'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isMobile } = useSidebar()

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className={cn('border-r', props.className)}
    >
      <SidebarTrigger
        size="lg"
        variant="outline"
        className={cn('absolute -right-5 top-4 h-10 w-10 rounded-full p-2', {
          hidden: isMobile,
        })}
      />

      <SidebarContent className="px-3 py-6 pr-4 lg:px-1 lg:py-1 lg:pr-4">
        <div className="relative mx-2 rounded-md border border-white/20 bg-muted-foreground/60 py-4">
          <p className="text-center font-bold">
            {format(new Date(), 'EEEE, LLL do')}
          </p>
        </div>

        {NAVIGATIONS.map((nav) => (
          <SidebarGroup key={nav.label}>
            <SidebarGroupLabel>{nav.label}</SidebarGroupLabel>

            <SidebarMenu>
              {nav.items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    tooltip={item.name}
                    className={cn('h-10 px-4 hover:bg-accent', {
                      'bg-muted': pathname.startsWith(item.url),
                    })}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon className="!h-5 !w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {/*
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
      </SidebarFooter> */}
    </Sidebar>
  )
}
