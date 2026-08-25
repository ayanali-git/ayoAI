import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { getServerAuthUser, supabaseAdmin } from '@/lib/supabase-server';
import { subscriptionService } from '@/lib/subscription-service';

export async function GET(request: NextRequest) {
    try {
        const { user, error: authError } = await getServerAuthUser(request);
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get profile with subscription info
        let { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('plan, subscription_status, customer_id, subscription_id')
            .eq('id', user.id)
            .maybeSingle();

        // If profile doesn't exist yet, auto-create a free profile
        if (!profile) {
            const userName = user.user_metadata?.full_name || 
                             user.user_metadata?.name || 
                             user.email?.split('@')[0] || '';
            const userAvatar = user.user_metadata?.avatar_url || 
                               user.user_metadata?.picture || null;

            const { data: newProfile } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    name: userName,
                    avatar_url: userAvatar,
                    plan: 'free',
                    subscription_status: 'inactive',
                }, { onConflict: 'id' })
                .select('plan, subscription_status, customer_id, subscription_id')
                .single();

            profile = newProfile;
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
