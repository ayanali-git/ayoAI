'use client';

import React, { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Message } from '@/lib/chat-service';
import { AyoAIIcon } from '@/components/brand/logo';
import ReactMarkdown from 'react-markdown';
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Share2,
  Paperclip,
  ArrowDown,
  Volume2,
  MoreHorizontal,
  Pencil
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import toast from 'react-hot-toast';

interface MessageListProps {
  messages: Message[];
  user: User | null;
  isTyping: boolean;
  pendingMessage: { content: string; files: File[] } | null;
  onRegenerate?: () => void;
  onEditMessage?: (content: string) => void;
}

export function MessageList({
  messages,
  user,
  isTyping,
  pendingMessage,
  onRegenerate,
  onEditMessage
}: MessageListProps) {
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  // Auto-scroll on new messages or typing
  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping, pendingMessage]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback(prev => ({ ...prev, [id]: prev[id] === type ? undefined! : type }));
    toast.success(type === 'up' ? 'Feedback submitted' : 'Feedback recorded');
  };

  let userMessageCounter = 0;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 px-4 sm:px-6">
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';
        const userMsgIndex = isUser ? userMessageCounter++ : null;
        const msgId = msg.id || `msg-${index}`;
        const isCopied = copiedId === msgId;

        if (isUser) {
          return (
            <div
              key={msgId}
              id={`message-user-${userMsgIndex}`}
              className="flex flex-col items-end group"
            >
              {/* Attached Files */}
              {msg.files && msg.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 justify-end">
                  {msg.files.map((file: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-secondary text-foreground text-xs px-3 py-1.5 rounded-full border border-border"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="truncate max-w-[150px] font-medium">
                        {file.filename || file.name || 'File'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* User Bubble Capsule */}
              <div className="bg-bubble dark:bg-[#2F2F2F] text-foreground text-[15px] leading-relaxed rounded-3xl px-5 py-3 max-w-[80%] shadow-sm whitespace-pre-wrap select-text">
                {msg.content}
              </div>

              {/* User Hover Actions Toolbar */}
              <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => copyToClipboard(msg.content, msgId)}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Copy prompt"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">Copy</TooltipContent>
                </Tooltip>

                {onEditMessage && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onEditMessage(msg.content)}
                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Edit prompt"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">Edit</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          );
        }

        // Assistant Message
        return (
          <div key={msgId} className="flex gap-4 items-start group">
            {/* Assistant Avatar Emblem */}
            <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <AyoAIIcon size={16} className="text-background" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              {/* Message Content */}
              <div className="chat-markdown text-foreground select-text">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>

              {/* Assistant Action Toolbar */}
              <div className="flex items-center gap-1.5 pt-1 text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => copyToClipboard(msg.content, msgId)}
                      className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
                      aria-label="Copy response"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">Copy</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleFeedback(msgId, 'up')}
                      className={`p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors ${
                        feedback[msgId] === 'up' ? 'text-foreground font-bold' : ''
                      }`}
                      aria-label="Good response"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">Good response</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleFeedback(msgId, 'down')}
                      className={`p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors ${
                        feedback[msgId] === 'down' ? 'text-foreground font-bold' : ''
                      }`}
                      aria-label="Bad response"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">Bad response</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(msg.content);
                        window.speechSynthesis.speak(utterance);
                      }}
                      className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
                      aria-label="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">Read aloud</TooltipContent>
                </Tooltip>

                {onRegenerate && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={onRegenerate}
                        className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
                        aria-label="Regenerate response"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">Regenerate</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => copyToClipboard(window.location.href, `share-${msgId}`)}
                      className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
                      aria-label="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">Share</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        );
      })}

      {/* Optimistic Pending User Message */}
      {pendingMessage && (
        <div className="flex flex-col items-end opacity-85 animate-in fade-in-0 duration-150">
          {pendingMessage.files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 justify-end">
              {pendingMessage.files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-secondary text-foreground text-xs px-3 py-1.5 rounded-full border border-border"
                >
                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                </div>
              ))}
            </div>
          )}
          <div className="bg-bubble dark:bg-[#2F2F2F] text-foreground text-[15px] leading-relaxed rounded-3xl px-5 py-3 max-w-[80%] shadow-sm whitespace-pre-wrap">
            {pendingMessage.content}
          </div>
        </div>
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex gap-4 items-start animate-in fade-in-0 duration-150">
          <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <AyoAIIcon size={16} className="text-background" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
            <div className="flex space-x-1 items-center">
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs">Thinking...</span>
          </div>
        </div>
      )}

      <div ref={scrollBottomRef} />
    </div>
  );
}
