// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API Route called');
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Auth header present:', !!authHeader);
    console.log('🔑 Auth header starts with Bearer:', authHeader?.startsWith('Bearer '));
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization token');
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('🎫 Token extracted (first 20 chars):', token.substring(0, 20) + '...');

    // Create Supabase client with the user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    console.log('🔧 Supabase client created');

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('👤 Auth check - User:', !!user);
    console.log('👤 Auth check - User ID:', user?.id);
    console.log('❌ Auth error:', authError);
    
    if (authError || !user) {
      console.error('Auth error details:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;
    console.log('📝 Message received:', message?.substring(0, 50));

    // Log what we're about to insert
    const insertData = {
      title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    console.log('💾 About to insert:', insertData);

    // Create a new chat with the authenticated user's ID
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert(insertData)
      .select()
      .single();

    if (chatError) {
      console.error('💥 Chat creation error details:', {
        message: chatError.message,
        details: chatError.details,
        hint: chatError.hint,
        code: chatError.code
      });
      return NextResponse.json(
        { error: `Failed to create chat: ${chatError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Chat created successfully:', chat);

    return NextResponse.json({ 
      success: true, 
      chatId: chat.id,
      chat: chat 
    });

  } catch (error) {
    console.error('💥 API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}