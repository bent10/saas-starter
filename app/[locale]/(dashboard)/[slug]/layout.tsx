import { ReactNode } from 'react';
import { getOrganizations, getOrganizationBySlug } from '@/features/org/actions/org-actions';
import { DashboardSidebar } from '@/features/org/components/dashboard-sidebar';
import { notFound, redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Menu } from "lucide-react";

export default async function OrgDashboardLayout({ 
  children, 
  params 
}: { 
  children: ReactNode, 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const locale = await getLocale();
  
  const [userOrgs, currentOrg] = await Promise.all([
    getOrganizations(),
    getOrganizationBySlug(slug)
  ]);

  if (!currentOrg) {
    notFound();
  }

  const isMember = userOrgs.some(o => o.id === currentOrg.id);
  if (!isMember) {
     if (userOrgs.length > 0) {
        redirect(`/${locale}/dashboard/${userOrgs[0].slug}`);
     } else {
        redirect(`/${locale}/create-org`);
     }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden border-b p-4 flex items-center bg-background sticky top-0 z-10">
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <DashboardSidebar organizations={userOrgs} currentOrgSlug={slug} />
            </SheetContent>
        </Sheet>
        <span className="ml-4 font-semibold">{currentOrg.name}</span>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
         <DashboardSidebar organizations={userOrgs} currentOrgSlug={slug} />
      </div>
      <main className="flex-1 bg-background p-4 md:p-0">
         {children}
      </main>
    </div>
  );
}
