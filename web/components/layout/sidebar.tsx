'use client'

import Link from 'next/link'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { usePathname } from 'next/navigation'
import { NAVIGATIONS } from '@/constants/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
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
                      hidden: !item.isVisible,
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
    </Sidebar>
  )
}
