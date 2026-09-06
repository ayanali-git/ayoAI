import React from 'react';
import { SidebarProvider } from '@/components/chat/sidebar-context';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden flex flex-col no-overscroll">
        {children}
      </div>
    </SidebarProvider>
  );
}
