'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Image,
  FileText,
  Sparkles,
  Crown,
  User,
  Settings,
  LogOut,
  Search,
  Plus,
  Star,
  Trash2,
  Send,
  Paperclip,
  Loader2,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { useDropzone } from 'react-dropzone';
import { chatService, type Chat, type Message } from '@/lib/chat-service';
import { fileService } from '@/lib/file-service';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<{ content: string, files: File[] } | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'text/*': ['.txt'],
      'application/*': ['.pdf', '.doc', '.docx']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    noClick: true,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      loadChats();
    }
  }, [user, loading, router]);

  const loadChats = async () => {
    try {
      const userChats = await chatService.getUserChats(supabase, user!.id);
      setChats(userChats);
    } catch (error) {
      console.error('Failed to load chats:', error);
      toast.error('Failed to load chat history');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return;

    const userMessageContent = message;
    const filesToUpload = [...uploadedFiles];

    // Clear input immediately for better UX
    setMessage('');
    setUploadedFiles([]);

    // Show pending message immediately (optimistic UI)
    setPendingMessage({ content: userMessageContent, files: filesToUpload });
    setIsTyping(true);

    try {
      // ✅ Get latest session and token
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session || !session.access_token) {
        throw new Error('User session not found. Please log in again.');
      }

      const token = session.access_token;

      // 🔁 Upload files if any
      let fileUploads = [];
      if (filesToUpload.length > 0) {
        setIsUploading(true);
        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            fileUploads.push(result.file);
          } else {
            console.error('File upload error:', await response.text());
            toast.error(`Failed to upload ${file.name}`);
          }
        }
        setIsUploading(false);
      }

      // 🔁 Send chat message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ again using the token
        },
        body: JSON.stringify({
          message: userMessageContent,
          chatId: currentChat?.id,
          files: fileUploads,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const result = await response.json();

      // Update current chat...
      // Update current chat with new messages
      if (currentChat?.id === result.chatId) {
        setCurrentChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, result.userMessage, result.assistantMessage]
        } : null);
      } else {
        // New chat created
        await loadChats();
        const newChat = await chatService.getUserChats(supabase, user!.id);
        const chat = newChat.find(c => c.id === result.chatId);
        if (chat) setCurrentChat(chat);
      }
      // (keep your logic here as-is)

    } catch (error: any) {
      console.error('Send message error:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsTyping(false);
      setPendingMessage(null);
    }
  };


  const startNewChat = () => {
    setCurrentChat(null);
    setMessage('');
    setUploadedFiles([]);
  };

  const deleteChat = async (chatId: string) => {
    try {
      await chatService.deleteChat(supabase, chatId);
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
      toast.success('Chat deleted');
    } catch (error) {
      console.error('Delete chat error:', error);
      toast.error('Failed to delete chat');
    }
  };

  const toggleStar = async (chatId: string, starred: boolean) => {
    try {
      await chatService.toggleChatStar(supabase, chatId, !starred);
      setChats(prev => prev.map(c =>
        c.id === chatId ? { ...c, starred: !starred } : c
      ));
    } catch (error) {
      console.error('Toggle star error:', error);
      toast.error('Failed to update chat');
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r bg-muted/30 flex flex-col`}>
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg">ayoAI</span>
                </div>
                <ThemeToggle />
              </div>

              <Button onClick={startNewChat} className="w-full mb-3">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Chat History */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {filteredChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${currentChat?.id === chat.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted'
                      }`}
                    onClick={() => setCurrentChat(chat)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium truncate">
                            {chat.title}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(chat.id, chat.starred);
                          }}
                        >
                          <Star className={`w-3 h-3 ${chat.starred ? 'text-yellow-500 fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* User Profile */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.user_metadata?.name?.[0] || user.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user.user_metadata?.name || user.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Free Plan
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push('/settings')}>
                  <Settings className="w-4 h-4 mr-1" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/upgrade')}>
                  Upgrade
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  {currentChat?.title || 'New Chat'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI Assistant powered by advanced language models
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <Crown className="w-3 h-3 mr-1" />
                Free Plan
              </Badge>
              <Button variant="outline" size="sm" onClick={() => router.push('/upgrade')}>
                Upgrade
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {currentChat?.messages.length ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {currentChat.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`p-4 rounded-lg ${msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : (msg.content.startsWith('I encountered an issue') || msg.content.startsWith('Gemini Error') || msg.content.startsWith('AI Service'))
                        ? 'bg-destructive/10 text-destructive border border-destructive/20'
                        : 'bg-muted'
                      }`}>
                      {msg.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.files.map((file, idx) => (
                            <div key={idx} className="text-xs opacity-70">
                              📎 {file.filename}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className={`${msg.role === 'user' ? 'order-1 mr-3' : 'order-2 ml-3'}`}>
                    <Avatar className="w-8 h-8">
                      {msg.role === 'user' ? (
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <AvatarFallback>
                        {msg.role === 'user' ? (
                          user.user_metadata?.name?.[0] || user.email?.[0] || 'U'
                        ) : (
                          'AI'
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </motion.div>
              ))}

              {/* Show pending user message immediately */}
              {pendingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] order-2">
                    <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                      <p className="text-sm whitespace-pre-wrap">{pendingMessage.content}</p>
                      {pendingMessage.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {pendingMessage.files.map((file, idx) => (
                            <div key={idx} className="text-xs opacity-70">
                              📎 {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2">
                        {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="order-1 mr-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata?.name?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </motion.div>
              )}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] order-1">
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                  <div className="order-2 ml-3">
                    <Avatar className="w-8 h-8">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </Avatar>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to ayoAI</h2>
                <p className="text-muted-foreground mb-6">
                  Start a conversation with your AI assistant. Ask questions, upload files, or generate images.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <Card className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-xs font-medium">Ask Anything</div>
                  </Card>
                  <Card className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <Image className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-xs font-medium">Generate Images</div>
                  </Card>
                  <Card className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <div className="text-xs font-medium">Analyze Files</div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            {/* File Uploads Display */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-muted rounded-lg p-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm truncate max-w-32">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-3">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message here... (or drag and drop files)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={(!message.trim() && uploadedFiles.length === 0) || isTyping || isUploading}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div>
                    {isDragActive ? 'Drop files here...' : 'Drag & drop files or click to upload'}
                  </div>
                  <div>
                    Press Enter to send, Shift+Enter for new line
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}