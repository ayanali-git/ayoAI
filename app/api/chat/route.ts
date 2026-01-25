// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { aiService } from '@/lib/ai-service';
import { chatService } from '@/lib/chat-service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API Route called');

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Auth header present:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization token');
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    // console.log('🎫 Token extracted');

    // Create Supabase client with the user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, chatId, files } = body;
    console.log('📝 Message received:', message?.substring(0, 50));

    let currentChatId = chatId;

    // If no chatId provided, create a new chat
    if (!currentChatId) {
      console.log('🆕 Creating new chat...');
      const newChat = await chatService.createChat(
        supabase,
        user.id,
        message.substring(0, 50) + (message.length > 50 ? '...' : '')
      );
      currentChatId = newChat.id;
      console.log('✅ New chat created:', currentChatId);
    }

    // Add the user message to the chat
    console.log('💬 Adding user message...');
    const userMessage = await chatService.addMessage(
      supabase,
      currentChatId,
      'user',
      message,
      { files: files || [] }
    );
    console.log('✅ User message added');

    // Get chat history for context
    const chats = await chatService.getUserChats(supabase, user.id);
    const currentChat = chats.find(c => c.id === currentChatId);

    // Prepare messages for AI (convert to OpenAI format)
    const aiMessages = currentChat?.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })) || [];

    // Generate AI response
    console.log('🤖 Generating AI response...');
    let fileContext = '';
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      // Separate images from other files
      for (const file of files) {
        if (file.fileType && file.fileType.startsWith('image/') && file.url) {
          imageUrls.push(file.url);
        } else {
          fileContext += `File: ${file.filename}\n`;
        }
      }
    }

    let aiContent = 'I apologize, but I encountered an error responding to your request.';
    let usage = undefined;

    try {
      const aiResponse = await aiService.generateResponse(aiMessages, fileContext, imageUrls);
      aiContent = aiResponse.content;
      usage = aiResponse.usage;
      console.log('✅ AI response generated');
    } catch (aiError: any) {
      console.error('❌ AI Generation failed:', aiError);
      aiContent = `I encountered an issue generating a response: ${aiError.message}. \n\nIf you are the developer, please check your API keys and quotas.`;
    }

    // Add the AI response to the chat
    console.log('💬 Adding AI message...');
    const assistantMessage = await chatService.addMessage(
      supabase,
      currentChatId,
      'assistant',
      aiContent
    );
    console.log('✅ AI message added');

    return NextResponse.json({
      success: true,
      chatId: currentChatId,
      userMessage,
      assistantMessage,
      usage
    });

  } catch (error: any) {
    console.error('💥 API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}