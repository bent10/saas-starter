// Billing Module Server Actions

export type BillingState = {
  success: boolean
  url?: string // Redirect URL for Stripe
  error?: string
}

/**
 * Creates a Stripe Checkout Session for upgrading/subscribing.
 * Restricted to OWNER.
 */
export declare function createCheckoutSession(
  orgId: string,
  priceId: string
): Promise<BillingState>

/**
 * Generates a Stripe Customer Portal session URL.
 * Restricted to OWNER.
 */
export declare function createPortalSession(
  orgId: string
): Promise<BillingState>

/**
 * Fetches current subscription details for the org.
 */
export declare function getSubscriptionDetails(orgId: string): Promise<any>
