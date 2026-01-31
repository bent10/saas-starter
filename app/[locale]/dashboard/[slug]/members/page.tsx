import { getMembers, getOrganizationBySlug } from '@/features/org/actions/org-actions';
import { MemberManagement } from '@/features/org/components/member-management';
import { createClient } from '@/shared/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function MembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  
  if (!org) notFound();

  const members = await getMembers(slug);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const currentUserMember = members.find(m => m.userId === user.id);
  const role = currentUserMember?.role || 'MEMBER';

  return (
    <div className="p-8 max-w-5xl mx-auto">
       <div className="mb-6">
         <h1 className="text-3xl font-bold tracking-tight">Organization Members</h1>
         <p className="text-muted-foreground mt-2">
            Manage who has access to this organization.
         </p>
       </div>
      <MemberManagement 
        orgId={org.id} 
        members={members} 
        currentUserRole={role}
        currentUserId={user.id}
      />
    </div>
  );
}
