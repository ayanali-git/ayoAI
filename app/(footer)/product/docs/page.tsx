'use client';

import { Book, Code, Key, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Guides, concepts, and technical references to help you build with ayoAI.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 mb-16">
          {[
            { icon: Zap, title: "Quickstart", desc: "Get up and running with your first API request in minutes." },
            { icon: Key, title: "Authentication", desc: "Learn how to manage API keys and authenticate your requests securely." },
            { icon: Code, title: "Prompt Engineering", desc: "Best practices and strategies for writing effective prompts." },
            { icon: Book, title: "SDKs & Libraries", desc: "Official libraries for Node.js, Python, and more." }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-card border border-border rounded-2xl hover:border-foreground/20 transition-colors cursor-pointer">
              <item.icon className="h-6 w-6 mb-4 text-foreground" />
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
