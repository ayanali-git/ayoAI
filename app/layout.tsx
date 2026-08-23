import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
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
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
                <Toaster
                  position="top-right"
                  containerStyle={{
                    top: 20,
                    right: 20,
                    zIndex: 99999,
                  }}
                  toastOptions={{
                    duration: 3500,
                    style: {
                      background: 'hsl(var(--popover))',
                      color: 'hsl(var(--popover-foreground))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                      maxWidth: '400px',
                    },
                    success: {
                      iconTheme: {
                        primary: 'hsl(var(--emerald))',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
              </SubscriptionProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
