import { supabase } from './supabase';

export interface FileUpload {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  userId: string;
  messageId?: string;
  createdAt: string;
}

export interface FileValidation {
  valid: boolean;
  error?: string;
}

export class FileService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  validateFile(file: File): FileValidation {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'File type not supported' };
    }

    return { valid: true };
  }

  async uploadFile(file: File, userId: string, messageId?: string): Promise<FileUpload> {
    try {
      // Validate file first
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Create unique filename
      const fileExtension = file.name.split('.').pop() || '';
      const uniqueFileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(uniqueFileName);

      // Save file metadata to database
      const fileRecord = {
        id: crypto.randomUUID(),
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        url: publicUrl,
        userId,
        messageId,
        createdAt: new Date().toISOString(),
        path: uniqueFileName
      };

      const { data: dbData, error: dbError } = await supabase
        .from('files')
        .insert([fileRecord])
        .select()
        .single();

      if (dbError) {
        // If database insert fails, cleanup the uploaded file
        await supabase.storage
          .from('uploads')
          .remove([uniqueFileName]);
        
        throw new Error(`Database error: ${dbError.message}`);
      }

      return {
        id: dbData.id,
        filename: dbData.filename,
        fileType: dbData.fileType,
        fileSize: dbData.fileSize,
        url: dbData.url,
        userId: dbData.userId,
        messageId: dbData.messageId,
        createdAt: dbData.createdAt
      };

    } catch (error: any) {
      console.error('File upload error:', error);
      throw new Error(`File upload failed: ${error.message || 'Unknown error'}`);
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      // Get file record first
      const { data: fileRecord, error: fetchError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('userId', userId)
        .single();

      if (fetchError || !fileRecord) {
        throw new Error('File not found or access denied');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('uploads')
        .remove([fileRecord.path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)
        .eq('userId', userId);

      if (dbError) {
        throw new Error(`Database deletion error: ${dbError.message}`);
      }

    } catch (error: any) {
      console.error('File deletion error:', error);
      throw new Error(`File deletion failed: ${error.message || 'Unknown error'}`);
    }
  }

  async getUserFiles(userId: string): Promise<FileUpload[]> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];

    } catch (error: any) {
      console.error('Get user files error:', error);
      throw new Error(`Failed to get user files: ${error.message || 'Unknown error'}`);
    }
  }

  async getFileById(fileId: string, userId: string): Promise<FileUpload | null> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('userId', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // File not found
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return data;

    } catch (error: any) {
      console.error('Get file by ID error:', error);
      throw new Error(`Failed to get file: ${error.message || 'Unknown error'}`);
    }
  }

  isImageFile(fileType: string): boolean {
    return fileType.startsWith('image/');
  }

  isTextFile(fileType: string): boolean {
    return fileType.startsWith('text/') || fileType === 'application/pdf';
  }

  getFileIcon(fileType: string): string {
    if (this.isImageFile(fileType)) {
      return '🖼️';
    } else if (this.isTextFile(fileType)) {
      return '📄';
    } else {
      return '📎';
    }
  }
}

export const fileService = new FileService();