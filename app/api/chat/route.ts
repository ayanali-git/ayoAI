import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { aiService } from '@/lib/ai-service';
import { chatService } from '@/lib/chat-service';
import { subscriptionService } from '@/lib/subscription-service';
import jwt from 'jsonwebtoken';


export async function POST(request: NextRequest) {
  try {
    const { message, chatId, files } = await request.json();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

let decoded: any;
try {
  decoded = jwt.decode(token);
} catch {
  return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
}

const userId = decoded?.sub;
if (!userId) {
  return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
}

const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

if (userError || !user) {
  return NextResponse.json({ error: 'User not found' }, { status: 401 });
}


    const usageCheck = await subscriptionService.checkUsageLimit(user.id, 'messages');
    if (!usageCheck.allowed) {
      return NextResponse.json({
        error: 'Daily message limit reached. Please upgrade your plan.',
        code: 'USAGE_LIMIT_EXCEEDED'
      }, { status: 429 });
    }

    let currentChatId = chatId;

    if (!currentChatId) {
      const newChat = await chatService.createChat(user.id, message.slice(0, 50) + (message.length > 50 ? '...' : ''));
      currentChatId = newChat.id;
    }

    const userMessage = await chatService.addMessage(currentChatId, 'user', message);

    let fileContext = '';
    if (files && files.length > 0) {
      fileContext = files.map((file: any) =>
        `File: ${file.filename} (${file.fileType})`
      ).join('\n');
    }

    const aiResponse = await aiService.generateResponse(
      [{ role: 'user', content: message }],
      fileContext
    );

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
