'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/ui/footer';

export default function FooterPagesLayout({ children }: { children: ReactNode }) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back
                    </Button>

                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            ayoAI
                        </span>
                    </Link>

                    <div className="w-[72px]" /> {/* Spacer for centering */}
                </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
