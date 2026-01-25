import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { fileService } from '@/lib/file-service';
import { aiService } from '@/lib/ai-service';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const messageId = formData.get('messageId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.decode(token) as { sub?: string };
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Create authenticated Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verify user with the token
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found or unauthorized' }, { status: 401 });
    }

    // Double check that the token belongs to the claimed user (optional but safer)
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Token mismatch' }, { status: 403 });
    }

    const validation = fileService.validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const uploadedFile = await fileService.uploadFile(supabase, file, userId, messageId);
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
