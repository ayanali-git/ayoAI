"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
  MoreHorizontal,
  Loader,
  PanelLeft,
  ArrowDown,
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
import toast from "react-hot-toast";

export default function ActiveChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  const [selectedModel, setSelectedModel] = useState("ayoAI 4o");
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && chatId) {
      loadChat();
      loadChats();
    }
  }, [user, chatId]);

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
      setMessages(details.messages || []);

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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
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
      if (result.assistantMessage) {
        setMessages((prev) => {
          // Avoid duplicate user message if it already exists
          const hasUser = prev.some(
            (m) => m.id === result.userMessage?.id || m.content === promptText
          );
          if (!hasUser && result.userMessage) {
            return [...prev, result.userMessage, result.assistantMessage];
          }
          return [...prev, result.assistantMessage];
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      let fileData: any[] = [];
      if (currentFiles.length > 0) {
        setIsUploading(true);
        for (const file of currentFiles) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadHeaders: Record<string, string> = {};
          if (session?.access_token) {
            uploadHeaders["Authorization"] = `Bearer ${session.access_token}`;
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
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header */}
        <header className="h-14 px-4 flex items-center justify-between border-b border-border/40 shrink-0 select-none">
          <div className="flex items-center gap-2">
            {/* Model Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-secondary text-sm font-semibold text-foreground transition-colors">
                  <span>{selectedModel}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-60 rounded-2xl p-1.5"
              >
                <DropdownMenuItem
                  onClick={() => setSelectedModel("ayoAI 4o")}
                  className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">ayoAI 4o</p>
                    <p className="text-xs text-muted-foreground">
                      Fast and intelligent for everyday tasks
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedModel("ayoAI Pro (o1)")}
                  className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">ayoAI Pro (o1)</p>
                    <p className="text-xs text-muted-foreground">
                      Advanced reasoning and complex problems
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Chat link copied");
                  }}
                  className="h-8 px-3 rounded-full border-border text-xs font-medium"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                Share conversation
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Message Stream */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative"
        >
          <MessageList
            messages={messages}
            user={user}
            isTyping={isTyping}
            pendingMessage={pendingMessage}
            onRegenerate={handleSend}
            onEditMessage={(content) => setInputValue(content)}
          />

          {/* Right-Edge TOC Navigator (Screenshots 3, 4, 5) */}
          <TocNavigator messages={messages} containerRef={scrollContainerRef} />
        </div>

        {/* Scroll-to-Bottom Button */}
        {showScrollBottom && (
          <div className="absolute bottom-24 right-1/2 translate-x-1/2 z-30">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={scrollToBottom}
                  className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                Scroll to bottom
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Floating Input Dock */}
        <ChatInput
          message={inputValue}
          onMessageChange={setInputValue}
          onSend={handleSend}
          uploadedFiles={uploadedFiles}
          onFilesChange={setUploadedFiles}
          isTyping={isTyping}
          isUploading={isUploading}
          showDisclaimer={true}
        />
      </div>
    </div>
  );
}
