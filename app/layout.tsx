import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/auth-provider';
import { SubscriptionProvider } from '@/components/subscription-provider';

export const metadata: Metadata = {
  title: 'ayoAI - Your AI-Powered Assistant',
  description: 'Interact with a smart AI assistant using text, images, and documents. Generate images, get answers, and boost your productivity.',
  keywords: 'AI assistant, artificial intelligence, chat, image generation, productivity',
  authors: [{ name: 'ayoAI' }],
  openGraph: {
    title: 'ayoAI - Your AI-Powered Assistant',
    description: 'Interact with a smart AI assistant using text, images, and documents.',
    url: 'https://ayoAI',
    siteName: 'ayoAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ayoAI - Your AI-Powered Assistant',
    description: 'Interact with a smart AI assistant using text, images, and documents.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
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
                  duration: 4000,
                  style: {
                    background: '#1a1a2e',
                    color: '#ffffff',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 92, 246, 0.1)',
                    maxWidth: '400px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                    style: {
                      background: '#1a1a2e',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                    style: {
                      background: '#1a1a2e',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                    },
                  },
                }}
              />
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}