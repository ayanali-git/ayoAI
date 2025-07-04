import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fileService } from '@/lib/file-service';
import { aiService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const messageId = formData.get('messageId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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

    // Validate file
    const validation = fileService.validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload file
    const uploadedFile = await fileService.uploadFile(file, user.id, messageId);

    // Analyze file content
    const analysis = await aiService.analyzeFile(file);

    return NextResponse.json({
      file: uploadedFile,
      analysis
    });

  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error', details: error.stack || error },
      { status: 500 }
    );
  }
}