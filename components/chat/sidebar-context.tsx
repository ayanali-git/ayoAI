'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
});

export function SidebarProvider({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(defaultOpen);

  // Sync state on client mount from cookie/localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)sidebar_open=(true|false)/);
      if (match) {
        setSidebarOpen(match[1] === 'true');
      } else {
        try {
          const stored = localStorage.getItem('sidebar_open');
          if (stored !== null) {
            setSidebarOpen(stored === 'true');
          }
        } catch (e) {}
      }
    }
  }, []);

  const persistState = (open: boolean) => {
    if (typeof document !== 'undefined') {
      document.cookie = `sidebar_open=${open}; path=/; max-age=31536000; SameSite=Lax`;
      try {
        localStorage.setItem('sidebar_open', String(open));
      } catch (e) {}
    }
  };

  const handleSetSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> = (action) => {
    setSidebarOpen((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      persistState(next);
      return next;
    });
  };

  const toggleSidebar = () => {
    handleSetSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen: handleSetSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  return useContext(SidebarContext);
}
