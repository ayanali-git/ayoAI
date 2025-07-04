export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { aiService } from '@/lib/ai-service';
import { chatService } from '@/lib/chat-service';
import { subscriptionService } from '@/lib/subscription-service';

export async function POST(request: NextRequest) {
  try {
    const { message, chatId, files } = await request.json();

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
    const usageCheck = await subscriptionService.checkUsageLimit(user.id, 'messages');
    if (!usageCheck.allowed) {
      return NextResponse.json({ 
        error: 'Daily message limit reached. Please upgrade your plan.',
        code: 'USAGE_LIMIT_EXCEEDED'
      }, { status: 429 });
    }

    let currentChatId = chatId;

    // Create new chat if none provided
    if (!currentChatId) {
      const newChat = await chatService.createChat(
        user.id, 
        message.slice(0, 50) + (message.length > 50 ? '...' : '')
      );
      currentChatId = newChat.id;
    }

    // Add user message
    const userMessage = await chatService.addMessage(currentChatId, 'user', message);

    // Process files if any
    let fileContext = '';
    if (files && files.length > 0) {
      // This would be enhanced to actually process the files
      fileContext = files.map((file: any) => 
        `File: ${file.filename} (${file.fileType})`
      ).join('\n');
    }

    // Generate AI response
    const aiResponse = await aiService.generateResponse(
      [{ role: 'user', content: message }],
      fileContext
    );

    // Add AI message
    const assistantMessage = await chatService.addMessage(
      currentChatId, 
      'assistant', 
      aiResponse.content
    );

    return NextResponse.json({
      chatId: currentChatId,
      userMessage,
      assistantMessage,
      usage: {
        remaining: usageCheck.remaining,
        limit: usageCheck.limit
      }
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error', details: error.stack || error },
      { status: 500 }
    );
  }
}