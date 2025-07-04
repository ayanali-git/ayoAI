import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/auth-provider';

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
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}