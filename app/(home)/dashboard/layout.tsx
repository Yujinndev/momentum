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
    <section>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="px-2 pt-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
