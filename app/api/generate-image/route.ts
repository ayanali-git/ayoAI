import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { subscriptionService } from '@/lib/subscription-service';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check usage limits
    const usageCheck = await subscriptionService.checkUsageLimit(user.id, 'images');
    if (!usageCheck.allowed) {
      return NextResponse.json({ 
        error: 'Daily image generation limit reached. Please upgrade your plan.',
        code: 'USAGE_LIMIT_EXCEEDED'
      }, { status: 429 });
    }

    // For demo purposes, return a placeholder image
    // In production, integrate with Replicate, Stable Diffusion, or similar API
    const imageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;

    return NextResponse.json({
      imageUrl,
      prompt,
      usage: {
        remaining: usageCheck.remaining - 1,
        limit: usageCheck.limit
      }
    });

  } catch (error) {
    console.error('Image generation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}