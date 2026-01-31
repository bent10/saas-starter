'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { LayoutDashboard, Users, Settings, CreditCard } from 'lucide-react';
import { OrgSwitcher } from './org-switcher';

type Org = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
};

export function DashboardSidebar({ 
  organizations, 
  currentOrgSlug 
}: { 
  organizations: Org[], 
  currentOrgSlug: string 
}) {
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: `/${locale}/dashboard/${currentOrgSlug}`,
      active: pathname === `/${locale}/dashboard/${currentOrgSlug}`,
    },
    {
      label: 'Members',
      icon: Users,
      href: `/${locale}/dashboard/${currentOrgSlug}/members`,
      active: pathname.includes('/members'),
    },
    {
      label: 'Billing',
      icon: CreditCard,
      href: `/${locale}/dashboard/${currentOrgSlug}/billing`,
      active: pathname.includes('/billing'),
    },
    {
      label: 'Settings',
      icon: Settings,
      href: `/${locale}/dashboard/${currentOrgSlug}/settings`,
      active: pathname.includes('/settings'),
    },
  ];

  return (
    <div className="flex flex-col h-full border-r bg-muted/10 w-64 p-4 space-y-4">
       <div className="mb-4">
         <OrgSwitcher organizations={organizations} currentOrgSlug={currentOrgSlug} />
       </div>
       
       <nav className="space-y-1">
         {routes.map((route) => (
           <Link
             key={route.href}
             href={route.href}
             className={cn(
               "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
               route.active 
                 ? "bg-primary/10 text-primary" 
                 : "text-muted-foreground hover:bg-muted"
             )}
           >
             <route.icon className="h-4 w-4" />
             {route.label}
           </Link>
         ))}
       </nav>
    </div>
  );
}
