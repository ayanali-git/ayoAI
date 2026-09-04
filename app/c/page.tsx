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
import { Loader, PanelRight, Plus } from "lucide-react";
import toast from "@/lib/toast";

export default function NewChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setSidebarOpen(false);
      } else {
        const saved = localStorage.getItem("ayoai_sidebar_open");
        setSidebarOpen(saved !== null ? saved === "true" : true);
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("ayoai_sidebar_open", String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    } else if (user) {
      loadChats();
    }
  }, [user, loading, router]);

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

      // 2. Mark pending prompt for immediate AI trigger in [id]/page
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `auto_send_${newChat.id}`,
          JSON.stringify({
            prompt: messageText,
          })
        );
      }

      // 3. Instantly navigate to the active chat!
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

  if (!user) {
    return null;
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
        onToggle={handleToggleSidebar}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Mobile Header when sidebar is closed */}
        <div className="md:hidden flex items-center justify-between px-3 py-2.5 border-b border-border/40 shrink-0 select-none">
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="p-1.5 rounded-xl text-foreground hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>

        {/* Content Stream (Welcome Zero State) */}
        <div className="flex-1 flex flex-col justify-center overflow-y-auto px-2 sm:px-4">
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
