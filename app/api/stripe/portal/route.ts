import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPortalSession } from '@/lib/stripe';

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

        // Get customer ID from profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('customer_id')
            .eq('id', user.id)
            .single();

        if (profileError || !profile?.customer_id) {
            return NextResponse.json(
                { error: 'No subscription found' },
                { status: 404 }
            );
        }

        // Create portal session
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const session = await createPortalSession(
            profile.customer_id,
            `${appUrl}/upgrade`
        );

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Portal error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create portal session' },
            { status: 500 }
        );
    }
}
