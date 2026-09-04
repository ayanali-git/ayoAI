"use client";

import React, { useRef, useEffect, useState, forwardRef } from "react";
import {
  Plus,
  ArrowUp,
  X,
  Mic,
  MicOff,
  Brain,
  FileText,
  Code,
  Image as ImageIcon,
  Film,
  Music,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import toast from "@/lib/toast";

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
  children?: React.ReactNode;
}

/** Get a human-readable file type label like ChatGPT */
function getFileTypeLabel(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const mime = file.type;

  if (mime.startsWith("image/")) return "Image";
  if (mime.startsWith("video/")) return "Video";
  if (mime.startsWith("audio/")) return "Audio";

  const codeExts: Record<string, string> = {
    tsx: "TypeScript",
    ts: "TypeScript",
    jsx: "JavaScript",
    js: "JavaScript",
    py: "Python",
    rb: "Ruby",
    go: "Go",
    rs: "Rust",
    java: "Java",
    c: "C",
    cpp: "C++",
    h: "Header",
    cs: "C#",
    swift: "Swift",
    kt: "Kotlin",
    vue: "Vue",
    svelte: "Svelte",
    html: "HTML",
    xml: "XML",
    yaml: "YAML",
    yml: "YAML",
    toml: "TOML",
    sh: "Shell",
    bash: "Shell",
    zsh: "Shell",
    css: "CSS",
    scss: "SCSS",
    sass: "SASS",
    less: "LESS",
    json: "JSON",
    jsonl: "JSON",
    md: "Markdown",
    mdx: "Markdown",
    sql: "SQL",
    php: "PHP",
  };

  if (codeExts[ext]) return codeExts[ext];
  if (["txt", "log", "csv"].includes(ext)) return "Text";
  if (["pdf"].includes(ext)) return "PDF";
  if (["doc", "docx"].includes(ext)) return "Document";
  if (["xls", "xlsx"].includes(ext)) return "Spreadsheet";
  if (["ppt", "pptx"].includes(ext)) return "Presentation";
  if (["zip", "tar", "gz", "rar", "7z"].includes(ext)) return "Archive";

  return "File";
}

/** Get icon component for file type */
function getFileIcon(file: File) {
  const mime = file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() || "";

  if (mime.startsWith("image/")) return ImageIcon;
  if (mime.startsWith("video/")) return Film;
  if (mime.startsWith("audio/")) return Music;

  const codeExtensions = [
    "tsx", "ts", "jsx", "js", "py", "rb", "go", "rs", "java", "c", "cpp", "h",
    "cs", "swift", "kt", "vue", "svelte", "html", "xml", "yaml", "yml", "toml",
    "sh", "bash", "zsh", "css", "scss", "sass", "less", "json", "sql", "php"
  ];
  if (codeExtensions.includes(ext)) return Code;

  return FileText;
}

/** ChatGPT-style preview card with thumbnail or code icon */
function FilePreviewCard({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const Icon = getFileIcon(file);
  const typeLabel = getFileTypeLabel(file);

  return (
    <div className="relative group flex items-center gap-2.5 bg-neutral-100 dark:bg-[#262626] border border-neutral-200/90 dark:border-white/10 rounded-2xl p-2 pr-4 text-foreground min-w-0 shadow-sm animate-in fade-in-0 duration-150">
      {/* File type icon or Image preview */}
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-white/5 flex items-center justify-center shrink-0 shadow-xs">
        {imageUrl ? (
          <img src={imageUrl} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <Icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        )}
      </div>

      {/* File info */}
      <div className="flex flex-col min-w-0 pr-0.5">
        <span className="text-[13.5px] font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[130px] sm:max-w-[160px] leading-tight">
          {file.name}
        </span>
        <span className="text-[11.5px] text-neutral-500 dark:text-neutral-400 capitalize leading-tight mt-0.5">
          {typeLabel}
        </span>
      </div>

      {/* Remove button — frosted glass circle with same design as scroll-to-bottom button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-300/90 dark:border-white/20 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-700 flex items-center justify-center cursor-pointer"
        aria-label="Remove file"
      >
        <X className="w-2.5 h-2.5 stroke-[2.5]" />
      </button>
    </div>
  );
}

export const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(function ChatInput(
  {
    message,
    onMessageChange,
    onSend,
    uploadedFiles,
    onFilesChange,
    isTyping,
    isUploading,
    centered = false,
    showDisclaimer = false,
    children,
  },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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

  // Speech Recognition (Web Speech API)
  const toggleDictation = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    try {
      // First prompt for microphone permission if needed
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err: any) {
      console.error("Microphone access error:", err);
      toast.error("Microphone access denied. Please allow microphone permission in your browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || "en-US";

      const baseText = message.trim();

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const updated = baseText ? `${baseText} ${transcript}` : transcript;
        onMessageChange(updated);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setIsListening(false);
          if (event.error === "not-allowed") {
            toast.error("Microphone permission denied.");
          }
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      toast.success("Listening... Speak now");
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err);
      toast.error("Could not start speech recognition.");
      setIsListening(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

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
      ref={ref}
      className={cn(
        "w-full select-none transition-all duration-200 relative",
        centered ? "max-w-2xl mx-auto px-2 sm:px-4" : "max-w-3xl mx-auto px-2 sm:px-4"
      )}
    >
      {children}
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

        {/* Attached Files Preview — ChatGPT-style cards (Image 3) */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1 pt-1 pb-2">
            {uploadedFiles.map((file, i) => (
              <FilePreviewCard key={i} file={file} onRemove={() => removeFile(i)} />
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
              className="w-full min-w-0 bg-transparent border-0 px-2 py-1.5 text-[14.5px] sm:text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0 resize-none min-h-[34px] max-h-[200px] leading-relaxed"
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
                  onClick={toggleDictation}
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0",
                    isListening
                      ? "bg-red-500/15 text-red-500 hover:bg-red-500/25 ring-red-500/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  aria-label={isListening ? "Stop dictation" : "Dictate"}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-md">
                {isListening ? "Stop dictation" : "Dictate"}
              </TooltipContent>
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

      {/* Responsive Disclaimer — ChatGPT style */}
      {showDisclaimer && (
        <div className="text-center pt-2 pb-0.5 px-3 select-none">
          <p className="text-[11px] sm:text-xs text-muted-foreground/60 font-normal tracking-tight leading-tight">
            closeAI can make mistakes. Verify important info.
          </p>
        </div>
      )}
    </div>
  );
});

export default ChatInput;
