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
  const [isThinkingMode, setIsThinkingMode] = useState(true);

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
        centered ? "max-w-2xl mx-auto" : "max-w-3xl mx-auto px-4 pb-2"
      )}
    >
      <div
        {...getRootProps()}
        className={cn(
          "relative bg-background dark:bg-[#212121] border border-border/80 dark:border-neutral-700/80 transition-all duration-200",
          isMultiLine || uploadedFiles.length > 0
            ? "rounded-3xl p-3"
            : "rounded-full px-3 py-1.5 min-h-[52px]",
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
                className="flex items-center gap-1.5 bg-secondary/80 border border-border/60 rounded-full pl-3 pr-2 py-1 text-xs text-foreground"
              >
                <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="truncate max-w-[140px] font-medium">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="p-0.5 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Row / Area */}
        <div
          className={cn(
            "flex items-center gap-2",
            isMultiLine ? "flex-col items-stretch" : "flex-row"
          )}
        >
          {/* Main Input Field */}
          <div className="flex-1 flex items-center min-w-0 pl-1">
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
                  className="w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0 cursor-pointer"
                  aria-label="Add attachment"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
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
              className="w-full bg-transparent border-0 px-3 py-2 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0 resize-none min-h-[36px] max-h-[200px] leading-relaxed"
            />
          </div>

          {/* Right Action Tools Dock */}
          <div
            className={cn(
              "flex items-center gap-1.5 shrink-0 pr-1",
              isMultiLine && "justify-end pt-1"
            )}
          >
            {/* Think Mode Pill Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setIsThinkingMode(!isThinkingMode)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-3 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer select-none",
                    isThinkingMode
                      ? "bg-secondary text-foreground hover:bg-secondary/80"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <Brain className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Think</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                Deep reasoning mode
              </TooltipContent>
            </Tooltip>

            {/* Dictate / Mic */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  aria-label="Dictate"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Dictate</TooltipContent>
            </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onSend}
                    disabled={isTyping || isUploading}
                    className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer ml-1"
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  Send message
                </TooltipContent>
              </Tooltip>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer - Only rendered when in active chat (showDisclaimer = true) */}
      {showDisclaimer && (
        <div className="mt-2 text-center select-none animate-in fade-in-50 duration-200">
          <p className="text-[11.5px] text-muted-foreground/80 font-normal">
            ayoAI can make mistakes. Verify important info.
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatInput;
