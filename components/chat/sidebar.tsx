'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Chat } from '@/lib/chat-service';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/components/subscription-provider';
import { CloseAIIcon } from '@/components/brand/logo';
import {
  Plus,
  Search,
  Trash2,
  Pin,
  PinOff,
  Settings,
  LogOut,
  PanelLeft,
  PanelRight,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Check,
  User as UserIcon,
  HelpCircle,
  Clock,
  PenLine,
  ArrowDownCircle,
  Command,
  FileText,
  Info,
  Bug,
  LifeBuoy,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarProps {
  user: User | null;
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onToggleStar: (chatId: string, starred: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Auto-scrolling title on hover
 */
function ChatTitleMarquee({ title, isHovered }: { title: string; isHovered: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowWidth, setOverflowWidth] = useState(0);

  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
      setOverflowWidth(diff > 0 ? diff : 0);
    }
  }, [title]);

  const duration = Math.max(1.8, overflowWidth / 24);

  return (
    <div ref={containerRef} className="relative flex-1 overflow-hidden min-w-0 pr-1">
      <span
        ref={textRef}
        style={{
          transform: isHovered && overflowWidth > 0 ? `translateX(-${overflowWidth + 10}px)` : 'translateX(0px)',
          transition: isHovered && overflowWidth > 0 ? `transform ${duration}s linear` : 'transform 0.25s ease-out',
        }}
        className="inline-block whitespace-nowrap text-[15px] leading-snug select-none"
      >
        {title || 'New chat'}
      </span>
    </div>
  );
}

const groupChatsByDate = (chats: Chat[]) => {
  const groups: Record<string, Chat[]> = {
    'Pinned': [],
    'Today': [],
    'Yesterday': [],
    'Previous 7 Days': [],
    'Previous 30 Days': [],
    'Older': []
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 7);
  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);

  chats.forEach(chat => {
    if (chat.starred) {
      groups['Pinned'].push(chat);
      return;
    }
    const chatDate = new Date(chat.updatedAt || chat.createdAt);
    if (chatDate >= today) groups['Today'].push(chat);
    else if (chatDate >= yesterday) groups['Yesterday'].push(chat);
    else if (chatDate >= last7Days) groups['Previous 7 Days'].push(chat);
    else if (chatDate >= last30Days) groups['Previous 30 Days'].push(chat);
    else groups['Older'].push(chat);
  });

  return groups;
};

export function Sidebar({
  user,
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onToggleStar,
  searchQuery,
  onSearchChange,
  isOpen,
  onToggle
}: SidebarProps) {
  const { signOut } = useAuth();
  const { plan: userPlan } = useSubscription();
  const { theme, setTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const filteredChats = chats.filter(chat =>
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChats = groupChatsByDate(filteredChats);
  const displayName = user?.user_metadata?.full_name || 
                      user?.user_metadata?.name || 
                      user?.email?.split('@')[0] || 
                      (user ? 'User' : 'Guest');
  const planDisplay = userPlan ? userPlan.charAt(0).toUpperCase() + userPlan.slice(1) : 'Free';
  const userEmail = user?.email || (user ? '' : 'Not signed in');
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  const [accountSubView, setAccountSubView] = useState<'main' | 'theme' | 'help' | 'accounts'>('main');
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Account Popover Menu Items (Responsive: Flyout on Desktop, In-Place on Mobile)
   */
  const renderAccountMenuItems = () => {
    // Mobile In-Place Subviews
    if (isMobileScreen && accountSubView === 'theme') {
      return (
        <div className="space-y-1 p-0.5">
          <button
            type="button"
            onClick={() => setAccountSubView('main')}
            className="flex items-center gap-2 px-2.5 py-2 text-md font-medium text-foreground hover:bg-secondary rounded-xl cursor-pointer w-full text-left transition-colors"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Theme</span>
          </button>
          <div className="h-[1px] bg-neutral-200 dark:bg-[#383838] my-1" />
          {[
            { label: 'Light', value: 'light', icon: Sun },
            { label: 'Dark', value: 'dark', icon: Moon },
            { label: 'System', value: 'system', icon: Laptop },
          ].map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTheme(t.value)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <t.icon className="w-4 h-4 text-muted-foreground" />
                <span>{t.label}</span>
              </div>
              {theme === t.value && <Check className="w-4 h-4 text-foreground" />}
            </button>
          ))}
        </div>
      );
    }

    if (isMobileScreen && accountSubView === 'help') {
      return (
        <div className="space-y-1 p-0.5">
          <button
            type="button"
            onClick={() => setAccountSubView('main')}
            className="flex items-center gap-2 px-2.5 py-2 text-md font-medium text-foreground hover:bg-secondary rounded-xl cursor-pointer w-full text-left transition-colors"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Help</span>
          </button>
          <div className="h-[1px] bg-neutral-200 dark:bg-[#383838] my-1" />
          <Link
            href="/support/help"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
            <span>Help center</span>
          </Link>
          <Link
            href="/company/blog"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors"
          >
            <PenLine className="w-4 h-4 text-muted-foreground" />
            <span>Release notes</span>
          </Link>
          <Link
            href="/product/docs"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowDownCircle className="w-4 h-4 text-muted-foreground" />
            <span>Download apps</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors"
          >
            <Command className="w-4 h-4 text-muted-foreground" />
            <span>Keyboard shortcuts</span>
          </Link>
          <div className="h-[1px] bg-neutral-200 dark:bg-[#383838] my-1" />
          <Link
            href="/support/terms"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors"
          >
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span>Terms of Service</span>
          </Link>
          <Link
            href="/support/privacy"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors"
          >
            <Info className="w-4 h-4 text-muted-foreground" />
            <span>Privacy Policy</span>
          </Link>
          <Link
            href="/company/contact"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors"
          >
            <Bug className="w-4 h-4 text-muted-foreground" />
            <span>Report a bug</span>
          </Link>
        </div>
      );
    }

    if (isMobileScreen && accountSubView === 'accounts') {
      return (
        <div className="space-y-1 p-0.5">
          <button
            type="button"
            onClick={() => setAccountSubView('main')}
            className="flex items-center gap-2 px-2.5 py-2 text-md font-medium text-foreground hover:bg-secondary rounded-xl cursor-pointer w-full text-left transition-colors"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Accounts</span>
          </button>
          <div className="h-[1px] bg-neutral-200 dark:bg-[#383838] my-1" />
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground select-none">
            <UserIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">{userEmail}</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="w-6 h-6 rounded-full border border-border shrink-0">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-[14px] font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-md font-medium truncate">{displayName}</span>
            </div>
            <Check className="w-4 h-4 text-foreground shrink-0 ml-2" />
          </div>
          <div className="h-[1px] bg-neutral-200 dark:bg-[#383838] my-1" />
          <Link
            href="/auth/login"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
            <span>Add account</span>
          </Link>
        </div>
      );
    }

    // Default Main View (Desktop uses DropdownMenuSub, Mobile uses Clickable Rows)
    return (
      <div className="space-y-0.5 p-0.5">
        {/* Account Info Button */}
        {isMobileScreen ? (
          <button
            type="button"
            onClick={() => setAccountSubView('accounts')}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-secondary text-left transition-colors cursor-pointer"
          >
            <Avatar className="w-8 h-8 rounded-full border border-border shrink-0">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-md font-semibold bg-secondary text-foreground">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-md font-medium truncate text-foreground leading-tight">{displayName}</p>
              <p className="text-md text-muted-foreground leading-tight">{planDisplay}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
          </button>
        ) : (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2.5 px-2.5 py-2 text-md rounded-xl cursor-pointer">
              <Avatar className="w-8 h-8 rounded-full border border-border shrink-0">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-md font-semibold bg-secondary text-foreground">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-md font-medium truncate text-foreground leading-tight">{displayName}</p>
                <p className="text-md text-muted-foreground leading-tight">{planDisplay}</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={2} alignOffset={-80} className="w-64 rounded-2xl p-1.5 bg-background dark:bg-[#212121] border border-border/80 dark:border-neutral-700/80">
              <div className="flex items-center gap-2 px-3 py-2 text-md text-muted-foreground select-none">
                <UserIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{userEmail}</span>
              </div>
              <DropdownMenuItem className="flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="w-6 h-6 rounded-full border border-border shrink-0">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-[14px] font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-md font-medium truncate">{displayName}</span>
                </div>
                <Check className="w-4 h-4 text-foreground shrink-0 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth/login" className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-md">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  <span>Add account</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        <div className="h-[1px] bg-neutral-200 dark:bg-[#383838] my-1 -mx-1.5" />

        {/* Upgrade plan */}
        <DropdownMenuItem asChild>
          <Link
            href="/upgrade"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span>Upgrade plan</span>
          </Link>
        </DropdownMenuItem>

        {/* Personalization */}
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md cursor-pointer"
          >
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Personalization</span>
          </Link>
        </DropdownMenuItem>

        {/* Profile */}
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md cursor-pointer"
          >
            <UserIcon className="w-4 h-4 text-muted-foreground" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-md cursor-pointer"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <div className="h-[1px] bg-neutral-200 dark:bg-[#383838] my-1 -mx-1.5" />

        {/* Theme Button / Dropdown */}
        {isMobileScreen ? (
          <button
            type="button"
            onClick={() => setAccountSubView('theme')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 dark:hidden text-muted-foreground" />
              <Moon className="w-4 h-4 hidden dark:block text-muted-foreground" />
              <span>Theme</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2.5 px-3 py-2 text-md rounded-xl cursor-pointer">
              <Sun className="w-4 h-4 dark:hidden text-muted-foreground" />
              <Moon className="w-4 h-4 hidden dark:block text-muted-foreground" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={2} alignOffset={-85} className="w-40 rounded-2xl p-1.5 bg-background dark:bg-[#212121] border border-border/80 dark:border-neutral-700/80">
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        {/* Help Button / Dropdown */}
        {isMobileScreen ? (
          <button
            type="button"
            onClick={() => setAccountSubView('help')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-md text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LifeBuoy className="w-4 h-4 text-muted-foreground" />
              <span>Help</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2.5 px-3 py-2 text-md rounded-xl cursor-pointer">
              <LifeBuoy className="w-4 h-4 text-muted-foreground" />
              <span>Help</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={2} alignOffset={-260} className="w-56 rounded-2xl p-1.5 bg-background dark:bg-[#212121] border border-border/80 dark:border-neutral-700/80">
              <DropdownMenuItem asChild>
                <Link href="/support/help" className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-md">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  <span>Help center</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/company/blog" className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-md">
                  <PenLine className="w-4 h-4 text-muted-foreground" />
                  <span>Release notes</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/product/docs" className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-md">
                  <ArrowDownCircle className="w-4 h-4 text-muted-foreground" />
                  <span>Download apps</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-md">
                  <Command className="w-4 h-4 text-muted-foreground" />
                  <span>Keyboard shortcuts</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/support/terms" className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-md">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>Terms of Service</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support/privacy" className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-md">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span>Privacy Policy</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/company/contact" className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-md">
                  <Bug className="w-4 h-4 text-muted-foreground" />
                  <span>Report a bug</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        <div className="h-[1px] bg-neutral-200 dark:bg-[#383838] my-1 -mx-1.5" />

        {/* Log out */}
        <DropdownMenuItem
          onClick={signOut}
          className="text-red-500 hover:text-red-500 focus:text-red-500 flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span className="font-medium">Log out</span>
        </DropdownMenuItem>
      </div>
    );
  };

  // ----------------------------------------------------
  // Collapsed Mini Sidebar (56px Rail on Desktop, Hidden on Mobile)
  // ----------------------------------------------------
  if (!isOpen) {
    return (
      <div className="hidden md:flex w-[56px] h-screen bg-sidebar border-r border-border flex-col items-center py-3.5 justify-between shrink-0 select-none z-30 relative group/rail">
        {/* Full-height border resize/toggle handle */}
        <div
          onClick={onToggle}
          style={{ cursor: 'ew-resize' }}
          className="absolute -right-[3px] top-0 bottom-0 w-[6px] z-10 hover:bg-foreground/15 transition-colors cursor-ew-resize"
        />

        <div className="flex flex-col items-center gap-2 relative z-20">
          {/* Brand Emblem / Expand (Open Sidebar Button) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggle}
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
                style={{ cursor: 'ew-resize' }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground hover:bg-secondary transition-colors !cursor-ew-resize [&_*]:!cursor-ew-resize"
                aria-label="Open sidebar"
              >
                {isLogoHovered ? (
                  <PanelRight className="w-4 h-4 text-foreground pointer-events-none" />
                ) : (
                  <CloseAIIcon size={22} className="pointer-events-none" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8} className="text-md">
              Open sidebar
            </TooltipContent>
          </Tooltip>

          {/* New Chat */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onNewChat}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                aria-label="New chat"
              >
                <Plus className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-md">
              New chat
            </TooltipContent>
          </Tooltip>

          {/* Search */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  onToggle();
                  setShowSearch(true);
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Search chats"
              >
                <Search className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-md">
              Search chats
            </TooltipContent>
          </Tooltip>

          {/* Pinned Shortcut */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggle}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Pinned chats"
              >
                <Pin className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-md">
              Pinned chats
            </TooltipContent>
          </Tooltip>
        </div>

        {/* User Profile Avatar */}
        <DropdownMenu onOpenChange={(open) => { if (!open) setAccountSubView('main'); }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-full overflow-hidden hover:opacity-90 transition-all cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 border-0">
                  <Avatar className="w-full h-full bg-secondary">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-md font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-md">
              {displayName}
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent
            side="right"
            align="end"
            className="w-64 rounded-2xl p-1.5 bg-popover/98 backdrop-blur-2xl border border-border/80"
          >
            {renderAccountMenuItems()}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // ----------------------------------------------------
  // Expanded Sidebar
  // ----------------------------------------------------
  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onToggle} />

      <aside className="fixed md:static inset-y-0 left-0 z-50 w-[260px] h-screen bg-sidebar border-r border-border/80 flex flex-col shrink-0 select-none group/sidebar">
        {/* Full-height border resize/toggle handle */}
        <div
          onClick={onToggle}
          style={{ cursor: 'col-resize' }}
          className="absolute -right-[3px] top-0 bottom-0 w-[6px] z-10 hover:bg-foreground/15 transition-colors"
        />

        {/* Top Header */}
        <div className="p-3 pb-2 flex items-center justify-between relative z-20">
          <Link href="/" className="flex items-center gap-2 px-1 hover:opacity-85 transition-opacity">
            <CloseAIIcon size={20} />
            <span className="font-semibold text-base tracking-tight text-foreground">closeAI</span>
          </Link>

          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6} className="text-md">
                Search chats
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  style={{ cursor: 'ew-resize' }}
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary !cursor-ew-resize [&_*]:!cursor-ew-resize"
                  onClick={onToggle}
                >
                  <PanelLeft className="w-4 h-4 pointer-events-none" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6} className="text-md">
                Close sidebar
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-3 pt-1 pb-2 space-y-2 relative z-20">
          <button
            onClick={() => {
              onNewChat();
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                onToggle();
              }
            }}
            className="w-full flex items-center justify-between h-10 px-3 rounded-xl hover:bg-secondary text-foreground text-md font-medium group cursor-pointer transition-all duration-150"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              <span>New chat</span>
            </div>
          </button>

          {/* Collapsible Search input */}
          {showSearch && (
            <div className="relative animate-in fade-in-0 slide-in-from-top-1 duration-150">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 h-8 text-md bg-secondary border-border rounded-lg"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Chat History Stream */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-4 py-2">
            {Object.entries(groupedChats).map(([group, groupChats]) => {
              if (groupChats.length === 0) return null;
              return (
                <div key={group} className="space-y-0.5">
                  <div className="px-3 py-1 text-[13px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
                    {group}
                  </div>
                  {groupChats.map((chat) => {
                    const isHovered = hoveredChatId === chat.id;
                    const isSelected = currentChatId === chat.id;

                    return (
                      <div
                        key={chat.id}
                        onClick={() => {
                          onChatSelect(chat.id);
                          if (typeof window !== 'undefined' && window.innerWidth < 768) {
                            onToggle();
                          }
                        }}
                        onMouseEnter={() => setHoveredChatId(chat.id)}
                        onMouseLeave={() => setHoveredChatId(null)}
                        className={cn(
                          'group relative flex items-center justify-between px-3 py-2 rounded-xl text-md cursor-pointer transition-all duration-150',
                          isSelected
                            ? 'bg-secondary text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}
                      >
                        {/* Title with Smooth Marquee on Hover */}
                        <ChatTitleMarquee
                          title={chat.title || 'New chat'}
                          isHovered={isHovered}
                        />

                        {/* Pinned status indicator when not hovered */}
                        {chat.starred && !isHovered && (
                          <PinOff className="w-4 h-4 text-muted-foreground/60 shrink-0 ml-1.5" />
                        )}

                        {/* Hover Actions with Smooth Fade */}
                        <div
                          className={cn(
                            'absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-gradient-to-l from-secondary via-secondary from-25% to-transparent pl-8 pr-1.5 py-1 rounded-r-xl transition-opacity duration-150 z-10',
                            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                          )}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleStar(chat.id, !chat.starred);
                                }}
                                className="p-1 rounded-md hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              >
                                {chat.starred ? (
                                  <PinOff className="w-4 h-4 text-foreground" />
                                ) : (
                                  <Pin className="w-4 h-4" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="text-md">
                              {chat.starred ? 'Unpin' : 'Pin'}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteChat(chat.id);
                                }}
                                className="p-1 rounded-md hover:bg-background/80 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="text-md">Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Bottom User Profile Dock (Matching Screenshot 1, 2) */}
        <div className="p-2 border-t border-border/80 mt-auto relative z-20">
          <DropdownMenu onOpenChange={(open) => { if (!open) setAccountSubView('main'); }}>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-secondary transition-colors text-left group cursor-pointer select-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 border-0">
                <Avatar className="w-8 h-8 rounded-full border border-border shrink-0">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-md font-semibold bg-secondary text-foreground">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium text-foreground truncate leading-snug">
                    {displayName}
                  </p>
                  <p className="text-[13px] text-muted-foreground leading-none">
                    {planDisplay}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={8}
              className="w-[244px] rounded-2xl p-1.5 mb-1 bg-background dark:bg-[#212121] border border-border/80 dark:border-neutral-700/80 outline-none focus:outline-none ring-0"
            >
              {renderAccountMenuItems()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
