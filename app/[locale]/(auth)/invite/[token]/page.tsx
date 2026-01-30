import { acceptInvitation } from '@/features/org/actions/org-actions';
import { signOut } from '@/features/auth/actions/auth-actions';
import { db } from '@/shared/lib/db/drizzle';
import { createClient } from '@/shared/lib/supabase/server';
import { Button } from '@/shared/components/ui/button';
import { notFound, redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const invitation = await db.query.invitations.findFirst({
      where: (invitations, { eq }) => eq(invitations.token, token),
      with: {
          organization: true,
      }
  });

  if (!invitation) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <h1 className="text-2xl font-bold mb-4">Invalid Invitation</h1>
              <p className="text-muted-foreground mb-4">This invitation does not exist or has expired.</p>
              <Button asChild>
                  <Link href="/">Go Home</Link>
              </Button>
          </div>
      )
  }

  if (new Date() > invitation.expiresAt) {
       return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <h1 className="text-2xl font-bold mb-4">Invitation Expired</h1>
              <p className="text-muted-foreground mb-4">This invitation has expired.</p>
               <Button asChild>
                  <Link href="/">Go Home</Link>
              </Button>
          </div>
      )
  }

  if (!user) {
      redirect(`/${locale}/login`);
  }

  if (user.email !== invitation.email) {
       return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
              <h1 className="text-2xl font-bold mb-4">Wrong Account</h1>
              <p className="text-muted-foreground mb-6">
                This invitation was sent to <strong>{invitation.email}</strong>,<br/>
                but you are logged in as <strong>{user.email}</strong>.
              </p>
              <form action={signOut}>
                 <Button variant="outline">Sign out</Button>
              </form>
          </div>
      )
  }
  
  const acceptAction = async () => {
    'use server';
    await acceptInvitation(token);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/20">
        <div className="w-full max-w-md space-y-6 bg-background p-8 rounded-xl border shadow-sm text-center">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Join Organization</h1>
                <p className="text-muted-foreground">
                    You have been invited to join <strong>{invitation.organization.name}</strong> as a <strong>{invitation.role}</strong>.
                </p>
            </div>
            
            <form action={acceptAction}>
                <Button className="w-full" size="lg">Accept Invitation</Button>
            </form>

            <div className="text-sm text-muted-foreground">
                Logged in as {user.email}
            </div>
        </div>
    </div>
  );
}
