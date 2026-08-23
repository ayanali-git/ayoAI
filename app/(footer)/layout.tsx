'use client';

import { ReactNode } from 'react';
import { MarketingHeader } from '@/components/marketing/header';
import { Footer } from '@/components/ui/footer';

export default function FooterPagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-5 sm:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
