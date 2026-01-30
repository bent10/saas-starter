'use client';

import { createCheckoutSession, createPortalSession } from '../actions/billing-actions';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

interface PricingProps {
  orgId: string;
  currentPlan: 'FREE' | 'PRO' | 'ENTERPRISE';
}

export function Pricing({ orgId, currentPlan }: PricingProps) {
  
  const handleUpgrade = async () => {
      // In a real app, priceId should be an env var or prop
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID; 
      if (!priceId) {
          toast.error("Pricing configuration missing (NEXT_PUBLIC_STRIPE_PRO_PRICE_ID)");
          return;
      }
      
      const result = await createCheckoutSession(orgId, priceId);
      if (result.success && result.url) {
          window.location.href = result.url;
      } else {
          toast.error(result.error || "Failed to start checkout");
      }
  };

  const handlePortal = async () => {
      const result = await createPortalSession(orgId);
      if (result.success && result.url) {
          window.location.href = result.url;
      } else {
          toast.error(result.error || "Failed to open portal");
      }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
      {/* FREE PLAN */}
      <Card className={currentPlan === 'FREE' ? 'border-primary' : ''}>
        <CardHeader>
          <CardTitle>Free</CardTitle>
          <CardDescription>For small teams just getting started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 3 members</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic features</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline" disabled={currentPlan === 'FREE'}>
            {currentPlan === 'FREE' ? 'Current Plan' : 'Downgrade'}
          </Button>
        </CardFooter>
      </Card>

      {/* PRO PLAN */}
      <Card className={currentPlan === 'PRO' ? 'border-primary shadow-lg' : ''}>
        <CardHeader>
          <CardTitle>Pro</CardTitle>
          <CardDescription>For growing teams with more needs.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></div>
           <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited members</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced analytics</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority support</li>
          </ul>
        </CardContent>
        <CardFooter>
          {currentPlan === 'PRO' ? (
             <Button className="w-full" onClick={handlePortal}>Manage Subscription</Button>
          ) : (
             <Button className="w-full" onClick={handleUpgrade}>Upgrade to Pro</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
