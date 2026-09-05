import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthUser, supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
    try {
        const { user, error: authError } = await getServerAuthUser(request);
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        let uploadResult = await supabaseAdmin.storage
            .from('uploads')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadResult.error && uploadResult.error.message.includes('Bucket not found')) {
            console.log('Bucket "uploads" not found. Creating public bucket...');
            await supabaseAdmin.storage.createBucket('uploads', { public: true });
            uploadResult = await supabaseAdmin.storage
                .from('uploads')
                .upload(filename, buffer, {
                    contentType: file.type,
                    upsert: false,
                });
        }

        if (uploadResult.error) {
            console.error('Upload error:', uploadResult.error);
            return NextResponse.json({ error: 'Failed to upload file: ' + uploadResult.error.message }, { status: 500 });
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
