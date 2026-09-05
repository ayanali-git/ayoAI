import { SupabaseClient } from '@supabase/supabase-js';

export interface Chat {
  id: string;
  title: string;
  starred: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages: Message[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  chatId: string;
  files?: any[];
}

export const chatService = {
  // Fetch chats WITHOUT messages for the sidebar list to be lightweight
  async getUserChats(supabase: SupabaseClient, userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map((chat: any) => ({
      id: chat.id,
      title: chat.title,
      starred: chat.starred || false,
      createdAt: chat.created_at,
      updatedAt: chat.updated_at,
      userId: chat.user_id,
      messages: [] // Empty messages for list view
    }));
  },

  // Fetch full details (messages) for a single chat
  async getChatDetails(supabase: SupabaseClient, chatId: string): Promise<Chat | null> {
    // 1. Get Chat Metadata
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single();

    if (chatError) throw chatError;

    // 2. Get Messages for this chat
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*, file_uploads(*)')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (msgError) throw msgError;

    return {
      id: chat.id,
      title: chat.title,
      starred: chat.starred || false,
      createdAt: chat.created_at,
      updatedAt: chat.updated_at,
      userId: chat.user_id,
      messages: messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.created_at,
        chatId: msg.chat_id,
        files: (msg.file_uploads && msg.file_uploads.length > 0)
          ? msg.file_uploads
          : (msg.metadata?.files || [])
      }))
    };
  },

  async deleteChat(supabase: SupabaseClient, chatId: string) {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) throw error;
  },

  async toggleChatStar(supabase: SupabaseClient, chatId: string, starred: boolean) {
    const { error } = await supabase
      .from('chats')
      .update({ starred })
      .eq('id', chatId);

    if (error) throw error;
  }
};
