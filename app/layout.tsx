import type { Metadata } from 'next';
import { ToasterProvider } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { SubscriptionProvider } from '@/components/subscription-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'ayoAI',
  description: 'AI assistant for research, coding, writing, and creating.',
  keywords: 'AI assistant, artificial intelligence, chat, productivity, generative AI',
  authors: [{ name: 'ayoAI' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ayoAI',
    description: 'AI assistant for research, coding, writing, and creating.',
    url: 'https://ayoai.com',
    siteName: 'ayoAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ayoAI',
    description: 'AI assistant for research, coding, writing, and creating.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={150}>
            <AuthProvider>
              <SubscriptionProvider>
                {children}
                <ToasterProvider />
              </SubscriptionProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
