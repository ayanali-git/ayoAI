import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { subscriptionService } from '@/lib/subscription-service';

// Create admin client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
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

        // Get profile with subscription info
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('plan, subscription_status, customer_id, subscription_id')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const plan = profile?.plan || 'free';
        const limits = subscriptionService.getUsageLimits(plan);

        // Get usage stats
        const messageUsage = await subscriptionService.checkUsageLimit(user.id, 'messages');
        const imageUsage = await subscriptionService.checkUsageLimit(user.id, 'images');

        return NextResponse.json({
            plan,
            status: profile?.subscription_status || 'inactive',
            hasActiveSubscription: profile?.subscription_status === 'active',
            customerId: profile?.customer_id,
            limits,
            usage: {
                messages: {
                    used: limits.dailyMessages === -1 ? 0 : limits.dailyMessages - messageUsage.remaining,
                    limit: messageUsage.limit,
                    remaining: messageUsage.remaining,
                },
                images: {
                    used: limits.dailyImageGenerations === -1 ? 0 : limits.dailyImageGenerations - imageUsage.remaining,
                    limit: imageUsage.limit,
                    remaining: imageUsage.remaining,
                },
            },
        });
    } catch (error: any) {
        console.error('Subscription API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get subscription' },
            { status: 500 }
        );
    }
}
