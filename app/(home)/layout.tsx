import Header from '@/components/layout/header'
import { AppSidebar } from '@/components/layout/sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { validateAccountCreationStatus } from '@/actions/account/validate-account-creation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await validateAccountCreationStatus()

  return (
    <section className="overflow-x-hidden">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
