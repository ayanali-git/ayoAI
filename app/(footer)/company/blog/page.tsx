'use client';

import { AnimatedArrow } from '@/components/ui/animated-arrow';
import Link from 'next/link';

export default function BlogPage() {
  const posts = [
    {
      title: "Introducing Frontier Chat: The Next Generation of Conversational AI",
      category: "Product",
      date: "August 20, 2026",
      readTime: "5 min read",
      excerpt: "Today we are releasing Frontier Chat, a new model trained to provide highly accurate, nuanced, and safe conversational interactions."
    },
    {
      title: "Advancements in Multimodal Vision Models",
      category: "Research",
      date: "August 15, 2026",
      readTime: "8 min read",
      excerpt: "Our latest research exploring how vision models can better understand spatial reasoning and context in complex images."
    },
    {
      title: "Commitment to AI Safety Guidelines",
      category: "Company",
      date: "August 02, 2026",
      readTime: "4 min read",
      excerpt: "An update on our ongoing efforts to establish robust safety guidelines and benchmarks for future AI models."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">Blog</h1>
          <p className="text-xl text-muted-foreground">The latest news, announcements, and research from the ayoAI team.</p>
        </header>

        <div className="space-y-12">
          {posts.map((post, i) => (
            <article key={i} className="group cursor-pointer">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="font-medium text-foreground">{post.category}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-semibold mb-3 group-hover:underline">{post.title}</h2>
              <p className="text-muted-foreground text-lg mb-4">{post.excerpt}</p>
              <div className="inline-flex items-center text-sm font-medium hover:underline">
                <span>Read article</span>
                <AnimatedArrow size={14} />
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
