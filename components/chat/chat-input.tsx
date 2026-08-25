"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Plus,
  ArrowUp,
  X,
  Mic,
  AudioWaveform,
  Sparkles,
  Brain,
  Paperclip,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  message: string;
  onMessageChange: (msg: string) => void;
  onSend: () => void;
  uploadedFiles: File[];
  onFilesChange: (files: File[]) => void;
  isTyping: boolean;
  isUploading: boolean;
  centered?: boolean;
  showDisclaimer?: boolean;
}

export function ChatInput({
  message,
  onMessageChange,
  onSend,
  uploadedFiles,
  onFilesChange,
  isTyping,
  isUploading,
  centered = false,
  showDisclaimer = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isThinkingMode, setIsThinkingMode] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      onFilesChange([...uploadedFiles, ...acceptedFiles]);
    },
    noClick: true,
    noKeyboard: true,
  });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollH, 200)}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (
        (message.trim() || uploadedFiles.length > 0) &&
        !isTyping &&
        !isUploading
      ) {
        onSend();
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  const hasContent = message.trim().length > 0 || uploadedFiles.length > 0;
  const isMultiLine =
    message.includes("\n") ||
    (textareaRef.current && textareaRef.current.scrollHeight > 48);

  return (
    <div
      className={cn(
        "w-full select-none transition-all duration-200",
        centered ? "max-w-2xl mx-auto px-2 sm:px-4" : "max-w-3xl mx-auto px-2 sm:px-4 pb-2"
      )}
    >
      <div
        {...getRootProps()}
        className={cn(
          "relative bg-background dark:bg-[#212121] border border-border/80 dark:border-neutral-700/80 transition-all duration-200",
          isMultiLine || uploadedFiles.length > 0
            ? "rounded-3xl p-2.5 sm:p-3"
            : "rounded-full px-1.5 sm:px-2 py-1 min-h-[48px] sm:min-h-[52px]",
          isDragActive && "ring-2 ring-primary border-primary"
        )}
      >
        <input {...getInputProps()} />

        {/* Attached Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1 pt-1 pb-2">
            {uploadedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-secondary/80 border border-border/60 rounded-full pl-3 pr-2 py-1 text-xs sm:text-sm text-foreground"
              >
                <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="p-0.5 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Row / Area */}
        <div
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            isMultiLine ? "flex-col items-stretch" : "flex-row"
          )}
        >
          {/* Main Input Field */}
          <div className="flex-1 flex items-center min-w-0 pl-0.5 sm:pl-1">
            {/* Attachment Button */}
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) {
                  onFilesChange([
                    ...uploadedFiles,
                    ...Array.from(e.target.files),
                  ]);
                }
              }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTyping || isUploading}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0 cursor-pointer"
                  aria-label="Add attachment"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-md">
                Add files and more
              </TooltipContent>
            </Tooltip>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              rows={1}
              disabled={isTyping || isUploading}
              className="w-full min-w-0 bg-transparent border-0 px-2 py-1.5 sm:py-2 text-[14.5px] sm:text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0 resize-none min-h-[34px] max-h-[200px] leading-relaxed"
            />
          </div>

          {/* Right Action Tools Dock */}
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 shrink-0 pr-0.5 sm:pr-1",
              isMultiLine && "justify-end pt-1"
            )}
          >
            {/* Think Mode Pill Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.preventDefault()}
                  style={{ cursor: "not-allowed" }}
                  className="hidden min-[420px]:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-medium text-muted-foreground/50 opacity-60 cursor-not-allowed select-none bg-transparent hover:bg-transparent"
                  aria-label="Think mode (Coming soon)"
                >
                  <Brain className="w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                  <span className="pointer-events-none hidden sm:inline">Think</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-md">
                Coming soon
              </TooltipContent>
            </Tooltip>

            {/* Dictate / Mic */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
                  aria-label="Dictate"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-md">Dictate</TooltipContent>
            </Tooltip>

            {/* Send Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onSend}
                  disabled={!hasContent || isTyping || isUploading}
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shrink-0",
                    hasContent && !isTyping && !isUploading
                      ? "bg-foreground text-background cursor-pointer hover:opacity-90 active:scale-95"
                      : "bg-neutral-300 dark:bg-[#383838] text-muted-foreground/50 cursor-not-allowed opacity-50"
                  )}
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-md">
                Send message
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
