'use client';

import { Search, HelpCircle, FileText, Settings } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">How can we help?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search for articles, guides, and FAQs..." 
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-full text-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-3 mb-16">
          <div className="p-6 bg-card border border-border rounded-2xl cursor-pointer hover:bg-secondary/50">
            <HelpCircle className="h-8 w-8 mb-4 text-foreground" />
            <h3 className="text-lg font-medium mb-2">Getting Started</h3>
            <p className="text-sm text-muted-foreground">Basics of using our web interface and features.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl cursor-pointer hover:bg-secondary/50">
            <Settings className="h-8 w-8 mb-4 text-foreground" />
            <h3 className="text-lg font-medium mb-2">Account & Billing</h3>
            <p className="text-sm text-muted-foreground">Manage subscriptions, usage limits, and invoices.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl cursor-pointer hover:bg-secondary/50">
            <FileText className="h-8 w-8 mb-4 text-foreground" />
            <h3 className="text-lg font-medium mb-2">Troubleshooting</h3>
            <p className="text-sm text-muted-foreground">Solutions for common errors and technical issues.</p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              "How do I reset my password?",
              "What are the usage limits for the free tier?",
              "Can I use generated content for commercial purposes?",
              "How do I upgrade to a team plan?"
            ].map((question, i) => (
              <div key={i} className="p-4 border-b border-border hover:bg-secondary/30 cursor-pointer">
                <span className="font-medium">{question}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
