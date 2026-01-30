import { getOrganizations } from '@/features/org/actions/org-actions';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function DashboardRootPage() {
  const locale = await getLocale();
  const orgs = await getOrganizations();

  if (orgs.length === 0) {
    redirect(`/${locale}/create-org`);
  }

  // Redirect to the first organization's dashboard
  redirect(`/${locale}/dashboard/${orgs[0].slug}`);
}
