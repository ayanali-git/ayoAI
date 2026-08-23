"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { chatService, Chat } from "@/lib/chat-service";
import { Sidebar } from "@/components/chat/sidebar";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { ChatInput } from "@/components/chat/chat-input";
import { AyoAIIcon } from "@/components/brand/logo";
import {
  ChevronDown,
  Sparkles,
  Share2,
  MoreHorizontal,
  Loader,
  PanelLeft,
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

export default function NewChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("ayoAI 4o");

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;
    try {
      const userChats = await chatService.getUserChats(supabase, user.id);
      setChats(userChats);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return;
    if (!user) {
      toast.error("Please log in to chat");
      router.push("/auth/login");
      return;
    }

    const messageText = message;
    const filesToSend = [...uploadedFiles];
    setMessage("");
    setUploadedFiles([]);
    setIsTyping(true);

    try {
      // 1. Create chat directly in Supabase immediately (<80ms)
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert({
          user_id: user.id,
          title:
            messageText.substring(0, 48) +
            (messageText.length > 48 ? "..." : ""),
          starred: false,
        })
        .select()
        .single();

      if (chatError || !newChat) {
        throw new Error(chatError?.message || "Failed to create chat");
      }

      // 2. Insert user message in Supabase immediately
      await supabase.from("messages").insert({
        chat_id: newChat.id,
        role: "user",
        content: messageText,
      });

      // 3. Mark pending prompt for immediate AI trigger in [id]/page
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `auto_send_${newChat.id}`,
          JSON.stringify({
            prompt: messageText,
          })
        );
      }

      // 4. Instantly navigate to the active chat!
      router.push(`/c/${newChat.id}`);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
      setMessage(messageText);
      setUploadedFiles(filesToSend);
      setIsTyping(false);
      setIsUploading(false);
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
      {/* Sidebar (Expanded or Mini Rail) */}
      <Sidebar
        user={user}
        chats={chats}
        currentChatId={null}
        onChatSelect={(id) => router.push(`/c/${id}`)}
        onNewChat={() => {
          setMessage("");
          setUploadedFiles([]);
        }}
        onDeleteChat={async (id) => {
          await chatService.deleteChat(supabase, id);
          loadChats();
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

      {/* Main Chat Workspace */}
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
                  onClick={() => toast.success("Link copied")}
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

        {/* Content Stream (Welcome Zero State) */}
        <div className="flex-1 flex flex-col justify-center overflow-y-auto px-2">
          <WelcomeScreen
            user={user}
            onPromptSelect={(prompt) => setMessage(prompt)}
          >
            <ChatInput
              message={message}
              onMessageChange={setMessage}
              onSend={handleSend}
              uploadedFiles={uploadedFiles}
              onFilesChange={setUploadedFiles}
              isTyping={isTyping}
              isUploading={isUploading}
              centered={true}
            />
          </WelcomeScreen>
        </div>
      </div>
    </div>
  );
}
