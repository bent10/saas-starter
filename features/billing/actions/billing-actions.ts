'use server';

import { stripe } from '@/shared/lib/stripe';
import { db } from '@/shared/lib/db/drizzle';
import { organizations, subscriptions } from '@/shared/lib/db/schema';
import { createClient } from '@/shared/lib/supabase/server';
import { eq } from 'drizzle-orm';

export type BillingState = {
  success: boolean;
  url?: string;
  error?: string;
};

export async function createCheckoutSession(
  orgId: string,
  priceId: string
): Promise<BillingState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify OWNER role
  const member = await db.query.members.findFirst({
    where: (members, { eq, and }) => and(
      eq(members.organizationId, orgId),
      eq(members.userId, user.id),
      eq(members.role, 'OWNER')
    ),
  });

  if (!member) {
    return { success: false, error: 'Unauthorized' };
  }

  const org = await db.query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.id, orgId),
  });

  if (!org) {
    return { success: false, error: 'Organization not found' };
  }

  try {
    let customerId = org.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: org.email || user.email || undefined,
        metadata: {
          orgId: org.id,
        },
      });
      customerId = customer.id;

      await db.update(organizations)
        .set({ stripeCustomerId: customerId })
        .where(eq(organizations.id, org.id));
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          orgId: org.id,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${org.slug}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${org.slug}?canceled=true`,
      metadata: {
        orgId: org.id,
      },
    });

    if (!session.url) {
      return { success: false, error: 'Failed to create checkout session' };
    }

    return { success: true, url: session.url };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createPortalSession(orgId: string): Promise<BillingState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify OWNER role
  const member = await db.query.members.findFirst({
    where: (members, { eq, and }) => and(
      eq(members.organizationId, orgId),
      eq(members.userId, user.id),
      eq(members.role, 'OWNER')
    ),
  });

  if (!member) {
    return { success: false, error: 'Unauthorized' };
  }

  const org = await db.query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.id, orgId),
  });

  if (!org || !org.stripeCustomerId) {
    return { success: false, error: 'Organization or billing details not found' };
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${org.slug}`,
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getSubscriptionDetails(orgId: string) {
    const sub = await db.query.subscriptions.findFirst({
        where: (subscriptions, { eq }) => eq(subscriptions.organizationId, orgId),
    });
    return sub;
}
