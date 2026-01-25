import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin client for storage operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        // Verify the user token
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${user.id}/${timestamp}_${sanitizedName}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('uploads')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            // If bucket doesn't exist, return a helpful error
            if (uploadError.message.includes('Bucket not found')) {
                return NextResponse.json({
                    error: 'Storage bucket "uploads" not found. Please create it in Supabase dashboard.'
                }, { status: 500 });
            }
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('uploads')
            .getPublicUrl(filename);

        return NextResponse.json({
            file: {
                filename: file.name,
                type: file.type,
                size: file.size,
                url: urlData.publicUrl,
                path: filename,
            },
        });

    } catch (error: any) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
