import Header from '@/components/layout/header'
import { AppSidebar } from '@/components/layout/sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="relative flex overflow-x-hidden">
      <SidebarProvider>
        <Header />
        <AppSidebar className="top-20" />

        <SidebarInset>
          <main className="px-2 pb-8 pt-[6.5rem] md:px-14">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
