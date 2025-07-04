import { supabase } from './supabase';

export interface Chat {
  id: string;
  userId: string;
  title: string;
  starred: boolean;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: any;
  createdAt: string;
  files?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
}

class ChatService {
  async createChat(userId: string, title: string): Promise<Chat> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: userId,
          title: title.slice(0, 100), // Limit title length
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create chat: ${error.message}`);
      }

      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        starred: data.starred,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        messages: [],
      };
    } catch (error) {
      console.error('Create chat error:', error);
      throw error;
    }
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          messages (
            id,
            role,
            content,
            metadata,
            created_at,
            file_uploads (
              id,
              filename,
              file_type,
              file_size,
              storage_path
            )
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to get chats: ${error.message}`);
      }

      return data.map(chat => ({
        id: chat.id,
        userId: chat.user_id,
        title: chat.title,
        starred: chat.starred,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
        messages: chat.messages.map((msg: any) => ({
          id: msg.id,
          chatId: chat.id,
          role: msg.role,
          content: msg.content,
          metadata: msg.metadata,
          createdAt: msg.created_at,
          files: msg.file_uploads?.map((file: any) => ({
            id: file.id,
            filename: file.filename,
            fileType: file.file_type,
            fileSize: file.file_size,
            storagePath: file.storage_path,
          })) || [],
        })),
      }));
    } catch (error) {
      console.error('Get user chats error:', error);
      throw error;
    }
  }

  async addMessage(chatId: string, role: 'user' | 'assistant', content: string, metadata?: any): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          role,
          content,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add message: ${error.message}`);
      }

      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      return {
        id: data.id,
        chatId: data.chat_id,
        role: data.role,
        content: data.content,
        metadata: data.metadata,
        createdAt: data.created_at,
        files: [],
      };
    } catch (error) {
      console.error('Add message error:', error);
      throw error;
    }
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: title.slice(0, 100) })
        .eq('id', chatId);

      if (error) {
        throw new Error(`Failed to update chat title: ${error.message}`);
      }
    } catch (error) {
      console.error('Update chat title error:', error);
      throw error;
    }
  }

  async toggleChatStar(chatId: string, starred: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ starred })
        .eq('id', chatId);

      if (error) {
        throw new Error(`Failed to update chat star: ${error.message}`);
      }
    } catch (error) {
      console.error('Toggle chat star error:', error);
      throw error;
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    try {
      // Messages and file uploads will be deleted automatically due to CASCADE
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) {
        throw new Error(`Failed to delete chat: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete chat error:', error);
      throw error;
    }
  }

  async searchChats(userId: string, query: string): Promise<Chat[]> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          messages (
            id,
            role,
            content,
            metadata,
            created_at
          )
        `)
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%,messages.content.ilike.%${query}%`)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search chats: ${error.message}`);
      }

      return data.map(chat => ({
        id: chat.id,
        userId: chat.user_id,
        title: chat.title,
        starred: chat.starred,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
        messages: chat.messages.map((msg: any) => ({
          id: msg.id,
          chatId: chat.id,
          role: msg.role,
          content: msg.content,
          metadata: msg.metadata,
          createdAt: msg.created_at,
          files: [],
        })),
      }));
    } catch (error) {
      console.error('Search chats error:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();