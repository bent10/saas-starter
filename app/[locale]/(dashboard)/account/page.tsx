import { createClient } from '@/shared/lib/supabase/server';
import { UserProfileForm } from '@/features/auth/components/user-profile-form';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function AccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const locale = await getLocale();

    if (!user) {
        redirect(`/${locale}/login`);
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4 pl-0">
                    <Link href={`/${locale}/dashboard`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your personal profile and settings.</p>
            </div>
            <UserProfileForm user={user} />
        </div>
    )
}
