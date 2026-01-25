// app/api/test-ai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
    });

    return NextResponse.json({ 
      response: response.choices[0]?.message?.content || 'No response',
      success: true 
    });

  } catch (error: any) {
    console.error('OpenAI Test Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate response',
      success: false 
    }, { status: 500 });
  }
}