import React from 'react';
import { cookies } from 'next/headers';
import { SidebarProvider } from '@/components/chat/sidebar-context';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar_open')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden flex flex-col no-overscroll">
        {children}
      </div>
    </SidebarProvider>
  );
}
