import { getOrganizationBySlug } from '@/features/org/actions/org-actions';
import { Pricing } from '@/features/billing/components/pricing';
import { notFound } from 'next/navigation';

export default async function BillingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  
  if (!org) notFound();

  return (
    <div className="p-8 max-w-5xl mx-auto">
       <div className="mb-6">
         <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
         <p className="text-muted-foreground mt-2">
            Manage your subscription and billing details.
         </p>
       </div>
       <Pricing orgId={org.id} currentPlan={org.plan} />
    </div>
  );
}
