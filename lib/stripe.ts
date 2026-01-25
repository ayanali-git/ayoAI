import Stripe from 'stripe';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});

// Plan price IDs mapping
export const PLAN_PRICES = {
    pro: {
        monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
        yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    },
    ultra: {
        monthly: process.env.STRIPE_ULTRA_MONTHLY_PRICE_ID!,
        yearly: process.env.STRIPE_ULTRA_YEARLY_PRICE_ID!,
    },
} as const;

// Get plan name from price ID
export function getPlanFromPriceId(priceId: string): string {
    if (priceId === PLAN_PRICES.pro.monthly || priceId === PLAN_PRICES.pro.yearly) {
        return 'pro';
    }
    if (priceId === PLAN_PRICES.ultra.monthly || priceId === PLAN_PRICES.ultra.yearly) {
        return 'ultra';
    }
    return 'free';
}

// Create or retrieve Stripe customer
export async function getOrCreateCustomer(
    userId: string,
    email: string,
    name?: string
): Promise<string> {
    // Search for existing customer by metadata
    const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
    });

    if (existingCustomers.data.length > 0) {
        const customer = existingCustomers.data[0];
        // Update metadata if needed
        if (customer.metadata?.userId !== userId) {
            await stripe.customers.update(customer.id, {
                metadata: { userId },
            });
        }
        return customer.id;
    }

    // Create new customer
    const customer = await stripe.customers.create({
        email,
        name: name || undefined,
        metadata: { userId },
    });

    return customer.id;
}

// Create checkout session
export async function createCheckoutSession(
    customerId: string,
    priceId: string,
    userId: string,
    successUrl: string,
    cancelUrl: string
): Promise<Stripe.Checkout.Session> {
    return stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            userId,
        },
        subscription_data: {
            metadata: {
                userId,
            },
        },
        allow_promotion_codes: true,
    });
}

// Create customer portal session
export async function createPortalSession(
    customerId: string,
    returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
    return stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });
}

// Get subscription details
export async function getSubscription(
    subscriptionId: string
): Promise<Stripe.Subscription | null> {
    try {
        return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return null;
    }
}

// Cancel subscription at period end
export async function cancelSubscription(
    subscriptionId: string
): Promise<Stripe.Subscription> {
    return stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
    });
}

// Resume subscription (undo cancellation)
export async function resumeSubscription(
    subscriptionId: string
): Promise<Stripe.Subscription> {
    return stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
    });
}
