import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
    stripe,
    PLAN_PRICES,
    getOrCreateCustomer,
    createCheckoutSession
} from '@/lib/stripe';

// Create admin client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        // Verify user
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { plan, interval } = await request.json();

        // Validate plan
        if (!plan || !['pro', 'ultra'].includes(plan)) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        // Validate interval
        if (!interval || !['monthly', 'yearly'].includes(interval)) {
            return NextResponse.json({ error: 'Invalid billing interval' }, { status: 400 });
        }

        // Get price ID
        const priceId = PLAN_PRICES[plan as keyof typeof PLAN_PRICES][interval as 'monthly' | 'yearly'];
        if (!priceId) {
            return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
        }

        // Get or create Stripe customer
        const customerId = await getOrCreateCustomer(
            user.id,
            user.email!,
            user.user_metadata?.name
        );

        // Update profile with customer ID
        await supabaseAdmin
            .from('profiles')
            .update({ customer_id: customerId })
            .eq('id', user.id);

        // Create checkout session
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const session = await createCheckoutSession(
            customerId,
            priceId,
            user.id,
            `${appUrl}/upgrade?success=true`,
            `${appUrl}/upgrade?canceled=true`
        );

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
