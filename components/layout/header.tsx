'use client'

import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { NAVIGATION_MENU } from '@/constants/navigation'

const Header = () => {
  const pathname = usePathname()
  const currentPath = NAVIGATION_MENU.find((menu) => menu.url === pathname)

  return (
    <header className="flex h-20 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div>
          <h1 className="text-xl">{currentPath?.name}</h1>
          <p className="text-sm text-muted-foreground">
            {currentPath?.description}
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
