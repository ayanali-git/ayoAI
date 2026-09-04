"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { chatService, Chat, Message } from "@/lib/chat-service";
import { Sidebar } from "@/components/chat/sidebar";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { TocNavigator } from "@/components/chat/toc-navigator";
import {
  ChevronDown,
  Share2,
  Upload,
  MoreHorizontal,
  Folder,
  Pin,
  PinOff,
  Archive,
  Trash2,
  Loader,
  ArrowDown,
  PanelRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import toast from "@/lib/toast";

export default function ActiveChatPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<{
    content: string;
    files: File[];
  } | null>(null);
  const [selectedModel, setSelectedModel] = useState("closeAI 4o");
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setSidebarOpen(false);
      } else {
        const saved = localStorage.getItem("closeai_sidebar_open");
        setSidebarOpen(saved !== null ? saved === "true" : true);
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("closeai_sidebar_open", String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    } else if (user && chatId) {
      loadChat();
      loadChats();
    }
  }, [user, loading, chatId, router]);

  // Handle scroll events to show/hide scroll-to-bottom button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 180;
    setShowScrollBottom(isScrolledUp);
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const loadChats = async () => {
    if (!user) return;
    try {
      const userChats = await chatService.getUserChats(supabase, user.id);
      setChats(userChats);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const loadChat = async () => {
    if (!user || !chatId) return;
    try {
      const details = await chatService.getChatDetails(supabase, chatId);
      if (!details) {
        router.push("/c");
        return;
      }
      // Deduplicate consecutive identical user messages (in case past legacy chats had duplicates)
      const rawMessages = details.messages || [];
      const cleanMessages = rawMessages.filter((msg, idx, arr) => {
        if (idx === 0) return true;
        const prevMsg = arr[idx - 1];
        if (
          msg.role === "user" &&
          prevMsg.role === "user" &&
          msg.content.trim() === prevMsg.content.trim()
        ) {
          return false;
        }
        return true;
      });
      setMessages(cleanMessages);

      // Check if this chat was just created with a pending auto-send prompt
      if (typeof window !== "undefined") {
        const autoKey = `auto_send_${chatId}`;
        const autoDataStr = sessionStorage.getItem(autoKey);
        if (autoDataStr) {
          sessionStorage.removeItem(autoKey);
          const autoData = JSON.parse(autoDataStr);
          if (autoData?.prompt) {
            triggerAiGeneration(autoData.prompt);
          }
        }
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      toast.error("Failed to load chat");
      router.push("/c");
    }
  };

  const triggerAiGeneration = async (promptText: string) => {
    setIsTyping(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          chatId,
          message: promptText,
          files: [],
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate response");
      }

      const result = await response.json();
      if (result.assistantMessage && result.userMessage) {
        setMessages((prev) => {
          const withoutDuplicate = prev.filter(
            (m) => m.id !== result.userMessage.id && m.content !== promptText
          );
          return [
            ...withoutDuplicate,
            result.userMessage,
            result.assistantMessage,
          ];
        });
      } else {
        const details = await chatService.getChatDetails(supabase, chatId);
        if (details?.messages) {
          setMessages(details.messages);
        }
      }
      await loadChats();
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast.error(error.message || "Failed to generate response");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;
    if (!user) return;

    const messageContent = inputValue;
    const currentFiles = [...uploadedFiles];

    setInputValue("");
    setUploadedFiles([]);
    setPendingMessage({ content: messageContent, files: currentFiles });
    setIsTyping(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let fileData: any[] = [];
      if (currentFiles.length > 0) {
        setIsUploading(true);
        for (const file of currentFiles) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadHeaders: Record<string, string> = {};
          if (token) {
            uploadHeaders["Authorization"] = `Bearer ${token}`;
          }

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            headers: uploadHeaders,
            body: formData,
          });

          if (uploadRes.ok) {
            const result = await uploadRes.json();
            fileData.push(result.file);
          }
        }
        setIsUploading(false);
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          chatId,
          message: messageContent,
          files: fileData,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to send message");
      }

      const result = await response.json();
      if (result.userMessage && result.assistantMessage) {
        setMessages((prev) => [
          ...prev,
          result.userMessage,
          result.assistantMessage,
        ]);
      } else {
        await loadChat();
      }
      await loadChats();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
      setInputValue(messageContent);
      setUploadedFiles(currentFiles);
    } finally {
      setIsTyping(false);
      setIsUploading(false);
      setPendingMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        user={user}
        chats={chats}
        currentChatId={chatId}
        onChatSelect={(id) => router.push(`/c/${id}`)}
        onNewChat={() => router.push("/c")}
        onDeleteChat={async (id) => {
          await chatService.deleteChat(supabase, id);
          if (id === chatId) router.push("/c");
          else loadChats();
        }}
        onToggleStar={async (id, starred) => {
          await chatService.toggleChatStar(supabase, id, starred);
          loadChats();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Full-height Scrollable Message Stream */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-auto overflow-x-hidden relative"
        >
          {/* Transparent Top Floating Header */}
          <header className="sticky top-0 z-20 h-14 px-3 sm:px-4 flex items-center justify-between select-none pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleToggleSidebar}
                    className="md:hidden w-8 h-8 rounded-xl bg-background dark:bg-[#212121] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer outline-none focus:outline-none"
                    aria-label="Toggle sidebar"
                  >
                    <PanelRight className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-md">
                  Toggle sidebar
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Chat link copied");
                    }}
                    className="h-8 px-2.5 sm:px-3.5 rounded-xl bg-background dark:bg-[#212121] border-0 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary dark:hover:bg-[#2f2f2f] cursor-pointer flex items-center gap-1.5 transition-colors outline-none focus:outline-none"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden min-[400px]:inline">Share</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-md">
                  Share conversation
                </TooltipContent>
              </Tooltip>

              {/* Three Dots Options Menu (Image 2, 3, 4) */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground bg-background dark:bg-[#212121] border-0 hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer outline-none focus:outline-none"
                        aria-label="Chat options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="text-md">More options</TooltipContent>
                </Tooltip>

                <DropdownMenuContent
                  align="end"
                  className="w-52 rounded-2xl p-1.5 bg-background dark:bg-[#212121] border border-border/80 dark:border-neutral-700/80"
                >
                  <DropdownMenuItem
                    onClick={() => toast("No files attached to this chat")}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-normal cursor-pointer text-foreground hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors"
                  >
                    <Folder className="w-4 h-4 text-muted-foreground" />
                    <span>View files in chat</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={async () => {
                      const currentChat = chats.find((c) => c.id === chatId);
                      const isStarred = currentChat?.starred;
                      await chatService.toggleChatStar(
                        supabase,
                        chatId,
                        !isStarred
                      );
                      loadChats();
                      toast.success(isStarred ? "Chat unpinned" : "Chat pinned");
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-normal cursor-pointer text-foreground hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors"
                  >
                    {chats.find((c) => c.id === chatId)?.starred ? (
                      <>
                        <PinOff className="w-4 h-4 text-muted-foreground" />
                        <span>Unpin chat</span>
                      </>
                    ) : (
                      <>
                        <Pin className="w-4 h-4 text-muted-foreground" />
                        <span>Pin chat</span>
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => toast.success("Chat archived")}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-normal cursor-pointer text-foreground hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors"
                  >
                    <Archive className="w-4 h-4 text-muted-foreground" />
                    <span>Archive</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={async () => {
                      await chatService.deleteChat(supabase, chatId);
                      router.push("/c");
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-normal cursor-pointer text-red-500 hover:bg-red-500/10 focus:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Messages Container */}
          <div className={cn("transition-all duration-200", uploadedFiles.length > 0 ? "pb-[150px]" : "pb-[92px] sm:pb-[98px]")}>
            <MessageList
              messages={messages}
              user={user}
              isTyping={isTyping}
              pendingMessage={pendingMessage}
              onRegenerate={handleSend}
              onEditMessage={(content) => setInputValue(content)}
            />
          </div>
          {/* Right-Edge TOC Navigator */}
          <TocNavigator messages={messages} containerRef={scrollContainerRef} />
        </div>

        {/* Floating Input Dock */}
        <div className="absolute bottom-0 left-0 right-0 sm:right-3 z-20 pointer-events-none pb-2 bg-gradient-to-t from-background via-background/90 to-transparent pt-4">
          <div className="pointer-events-auto">
            <ChatInput
              message={inputValue}
              onMessageChange={setInputValue}
              onSend={handleSend}
              uploadedFiles={uploadedFiles}
              onFilesChange={setUploadedFiles}
              isTyping={isTyping}
              isUploading={isUploading}
              showDisclaimer={true}
            >
              {/* Dynamic Floating Scroll-to-Bottom Button — stays right above input pill */}
              <AnimatePresence>
                {showScrollBottom && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.92 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={scrollToBottom}
                          className="w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200/90 dark:border-neutral-700/60 flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-700 transition-all cursor-pointer shadow-md"
                          aria-label="Scroll to bottom"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={8} className="text-md">
                        Scroll to bottom
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>
            </ChatInput>
          </div>
        </div>
      </div>
    </div>
  );
}
