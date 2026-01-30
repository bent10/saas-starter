import { headers } from 'next/headers';
import { stripe } from '@/shared/lib/stripe';
import { db } from '@/shared/lib/db/drizzle';
import { organizations, subscriptions } from '@/shared/lib/db/schema';
import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session | Stripe.Subscription;

  if (event.type === 'checkout.session.completed') {
    const checkoutSession = session as Stripe.Checkout.Session;
    const subscriptionId = checkoutSession.subscription as string;
    const orgId = checkoutSession.metadata?.orgId;

    if (orgId && subscriptionId) {
       // Update organization with customer ID if missing
       if (checkoutSession.customer) {
           await db.update(organizations)
            .set({ stripeCustomerId: checkoutSession.customer as string })
            .where(eq(organizations.id, orgId));
       }

       const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
       
       await db.insert(subscriptions).values({
           organizationId: orgId,
           stripeId: subscriptionId,
           status: subscription.status as any,
           priceId: subscription.items.data[0].price.id,
           currentPeriodStart: new Date(subscription.current_period_start * 1000),
           currentPeriodEnd: new Date(subscription.current_period_end * 1000),
       }).onConflictDoUpdate({
           target: subscriptions.stripeId,
           set: {
               status: subscription.status as any,
               currentPeriodEnd: new Date(subscription.current_period_end * 1000),
               priceId: subscription.items.data[0].price.id,
           }
       });

       // Update Org Plan (Assume PRO)
       await db.update(organizations).set({ plan: 'PRO' }).where(eq(organizations.id, orgId));
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = session as any;
      // const orgId = subscription.metadata?.orgId; 
      
      const existingSub = await db.query.subscriptions.findFirst({
          where: (subscriptions, { eq }) => eq(subscriptions.stripeId, subscription.id),
      });

      if (existingSub) {
          await db.update(subscriptions).set({
              status: subscription.status as any,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              priceId: subscription.items.data[0].price.id,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
          }).where(eq(subscriptions.stripeId, subscription.id));

          if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
              await db.update(organizations).set({ plan: 'FREE' }).where(eq(organizations.id, existingSub.organizationId));
          } else if (subscription.status === 'active' || subscription.status === 'trialing') {
             await db.update(organizations).set({ plan: 'PRO' }).where(eq(organizations.id, existingSub.organizationId));
          }
      }
  }

  return new Response(null, { status: 200 });
}
