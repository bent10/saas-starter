'use client';

import { useParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { ChevronsUpDown, Plus } from 'lucide-react';
import Link from 'next/link';

type Org = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
};

export function OrgSwitcher({ 
  organizations, 
  currentOrgSlug 
}: { 
  organizations: Org[], 
  currentOrgSlug: string 
}) {
  const params = useParams();
  const locale = params.locale as string;
  
  const currentOrg = organizations.find(o => o.slug === currentOrgSlug);
  
  if (!currentOrg) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">{currentOrg.name}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>My Organizations</DropdownMenuLabel>
        {organizations.map((org) => (
          <DropdownMenuItem key={org.id} asChild>
            <Link href={`/${locale}/dashboard/${org.slug}`}>
              {org.name}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/create-org`}>
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
