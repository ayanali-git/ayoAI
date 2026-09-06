import './globals.css';
import 'katex/dist/katex.min.css';
import 'goey-toast/styles.css';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { ToasterProvider } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { SubscriptionProvider } from '@/components/subscription-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'CloseAI',
  description: 'AI assistant for research, coding, writing, and creating.',
  keywords: 'AI assistant, artificial intelligence, chat, productivity, generative AI',
  authors: [{ name: 'CloseAI' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/closeai-app-icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'CloseAI',
    description: 'AI assistant for research, coding, writing, and creating.',
    url: 'https://closeai.com',
    siteName: 'CloseAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloseAI',
    description: 'AI assistant for research, coding, writing, and creating.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const initialPlan = cookieStore.get('user_plan')?.value || 'free';

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
              <SubscriptionProvider initialPlan={initialPlan}>
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
