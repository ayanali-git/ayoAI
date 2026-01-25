'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit3,
  Pin
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

// Helper function to group chats by date
const groupChatsByDate = (chats: Chat[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const groups: { [key: string]: Chat[] } = {
    'Pinned': [],
    'Today': [],
    'Yesterday': [],
    'Previous 7 Days': [],
    'Previous 30 Days': [],
    'Older': []
  };

  chats.forEach(chat => {
    const chatDate = new Date(chat.updatedAt || chat.createdAt);

    if (chat.starred) {
      groups['Pinned'].push(chat);
    } else if (chatDate >= today) {
      groups['Today'].push(chat);
    } else if (chatDate >= yesterday) {
      groups['Yesterday'].push(chat);
    } else if (chatDate >= lastWeek) {
      groups['Previous 7 Days'].push(chat);
    } else if (chatDate >= lastMonth) {
      groups['Previous 30 Days'].push(chat);
    } else {
      groups['Older'].push(chat);
    }
  });

  return groups;
};

export default function ChatPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<{ content: string, files: File[] } | null>(null);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  // Get user's plan dynamically
  const userPlan = useMemo(() => {
    return user?.user_metadata?.plan || 'free';
  }, [user]);

  const planLabel = useMemo(() => {
    const plans: { [key: string]: string } = {
      'free': 'Free Plan',
      'pro': 'Pro Plan',
      'ultra': 'Ultra Pro'
    };
    return plans[userPlan] || 'Free Plan';
  }, [userPlan]);

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
    maxSize: 10 * 1024 * 1024,
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
      toast.error('Failed to load chat history');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return;

    const userMessageContent = message;
    const filesToUpload = [...uploadedFiles];

    setMessage('');
    setUploadedFiles([]);
    setPendingMessage({ content: userMessageContent, files: filesToUpload });
    setIsTyping(true);

    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session || !session.access_token) {
        throw new Error('User session not found. Please log in again.');
      }

      const token = session.access_token;

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
            toast.error(`Failed to upload ${file.name}`);
          }
        }
        setIsUploading(false);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

      if (currentChat?.id === result.chatId) {
        setCurrentChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, result.userMessage, result.assistantMessage]
        } : null);
      } else {
        await loadChats();
        const newChat = await chatService.getUserChats(supabase, user!.id);
        const chat = newChat.find(c => c.id === result.chatId);
        if (chat) setCurrentChat(chat);
      }

    } catch (error: any) {
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
      toast.error('Failed to update chat');
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChats = groupChatsByDate(filteredChats);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: sidebarCollapsed ? 72 : 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="border-r bg-[#0a0a12] flex flex-col relative overflow-hidden"
          >
            {/* Sidebar Header */}
            <div className={`p-3 border-b border-white/5 ${sidebarCollapsed ? 'px-2' : ''}`}>
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} mb-3`}>
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">ayoAI</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  {!sidebarCollapsed && <ThemeToggle />}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/5"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                onClick={startNewChat}
                className={`w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white ${sidebarCollapsed ? 'px-2' : ''}`}
              >
                <Plus className="w-4 h-4" />
                {!sidebarCollapsed && <span className="ml-2">New Chat</span>}
              </Button>

              {!sidebarCollapsed && (
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                  />
                </div>
              )}
            </div>

            {/* Chat History */}
            <ScrollArea className="flex-1">
              <div className={`${sidebarCollapsed ? 'p-2' : 'p-3'} space-y-4`}>
                {Object.entries(groupedChats).map(([groupName, groupChats]) => {
                  if (groupChats.length === 0) return null;

                  return (
                    <div key={groupName}>
                      {!sidebarCollapsed && (
                        <div className="flex items-center gap-2 px-2 mb-2">
                          {groupName === 'Pinned' && <Pin className="w-3 h-3 text-yellow-500" />}
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {groupName}
                          </span>
                        </div>
                      )}
                      <div className="space-y-1">
                        {groupChats.map((chat) => (
                          <motion.div
                            key={chat.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`group relative rounded-lg cursor-pointer transition-all duration-150 ${currentChat?.id === chat.id
                                ? 'bg-white/10'
                                : 'hover:bg-white/5'
                              } ${sidebarCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}
                            onClick={() => setCurrentChat(chat)}
                            onMouseEnter={() => setHoveredChatId(chat.id)}
                            onMouseLeave={() => setHoveredChatId(null)}
                          >
                            {sidebarCollapsed ? (
                              <MessageCircle className="w-5 h-5 text-gray-400" />
                            ) : (
                              <>
                                <div className="flex items-center gap-3">
                                  <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-200 truncate pr-16">
                                      {chat.title}
                                    </div>
                                  </div>
                                </div>

                                {/* Action buttons on hover */}
                                <AnimatePresence>
                                  {hoveredChatId === chat.id && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#0a0a12]/90 rounded-md p-1"
                                    >
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-gray-400 hover:text-yellow-500 hover:bg-white/10"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleStar(chat.id, chat.starred);
                                        }}
                                      >
                                        <Star className={`w-3.5 h-3.5 ${chat.starred ? 'text-yellow-500 fill-current' : ''}`} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-white/10"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteChat(chat.id);
                                        }}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* User Profile Section */}
            <div className={`border-t border-white/5 ${sidebarCollapsed ? 'p-2' : 'p-3'}`}>
              {sidebarCollapsed ? (
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="w-10 h-10 ring-2 ring-purple-500/30">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.user_metadata?.name?.[0] || user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors mb-2">
                    <Avatar className="w-10 h-10 ring-2 ring-purple-500/30">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                        {user.user_metadata?.name?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {user.user_metadata?.name || user.email?.split('@')[0]}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${userPlan === 'pro' ? 'bg-blue-500' : userPlan === 'ultra' ? 'bg-purple-500' : 'bg-gray-500'}`} />
                        <span className="text-xs text-gray-400">{planLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-white/5 justify-start"
                      onClick={() => router.push('/settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 justify-start"
                      onClick={() => router.push('/upgrade')}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 justify-start mt-1"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0f0f1a]">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 bg-[#0f0f1a]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white hover:bg-white/5"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {currentChat?.title || 'New Chat'}
                </h1>
                <p className="text-xs text-gray-500">
                  AI Assistant powered by advanced language models
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${userPlan === 'pro' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : userPlan === 'ultra' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                <Crown className="w-3 h-3 mr-1" />
                {planLabel}
              </Badge>
              {userPlan === 'free' && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                  onClick={() => router.push('/upgrade')}
                >
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {currentChat?.messages.length ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {currentChat.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {msg.role === 'user' ? (
                        <>
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {user.user_metadata?.name?.[0] || user.email?.[0] || 'U'}
                          </AvatarFallback>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </Avatar>
                    <div className={`p-4 rounded-2xl ${msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : (msg.content.startsWith('I encountered an issue') || msg.content.startsWith('Gemini Error') || msg.content.startsWith('AI Service'))
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-white/5 text-gray-200 border border-white/5'
                      }`}>
                      {msg.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2 prose-code:text-purple-400 prose-code:bg-purple-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.files.map((file, idx) => (
                            <div key={idx} className="text-xs opacity-70 flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              {file.filename}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-xs opacity-50 mt-2">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pending message */}
              {pendingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="flex gap-3 max-w-[85%] flex-row-reverse">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                        {user.user_metadata?.name?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <p className="text-sm whitespace-pre-wrap">{pendingMessage.content}</p>
                      {pendingMessage.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {pendingMessage.files.map((file, idx) => (
                            <div key={idx} className="text-xs opacity-70 flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[85%]">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </Avatar>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm text-gray-400">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-3">Welcome to ayoAI</h2>
                <p className="text-gray-400 mb-8">
                  Start a conversation with your AI assistant. Ask questions, upload files, or generate images.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <MessageCircle className="w-8 h-8 mx-auto mb-3 text-blue-400 group-hover:scale-110 transition-transform" />
                    <div className="text-sm font-medium text-gray-200">Ask Anything</div>
                  </Card>
                  <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <Image className="w-8 h-8 mx-auto mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
                    <div className="text-sm font-medium text-gray-200">Generate Images</div>
                  </Card>
                  <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <FileText className="w-8 h-8 mx-auto mb-3 text-green-400 group-hover:scale-110 transition-transform" />
                    <div className="text-sm font-medium text-gray-200">Analyze Files</div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-[#0f0f1a]">
          <div className="max-w-4xl mx-auto">
            {/* File Uploads Display */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300 truncate max-w-32">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-gray-400 hover:text-red-400"
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
              className={`rounded-2xl p-4 transition-all ${isDragActive
                  ? 'bg-purple-500/10 border-2 border-dashed border-purple-500/50'
                  : 'bg-white/5 border border-white/10'
                }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-3">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Message ayoAI..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[60px] max-h-[200px] resize-none bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
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
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
                      onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={(!message.trim() && uploadedFiles.length === 0) || isTyping || isUploading}
                      className="h-10 w-10 p-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
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