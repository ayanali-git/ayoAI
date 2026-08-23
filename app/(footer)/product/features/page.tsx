'use client';

import { FileSearch, MessageSquare, Terminal, Eye } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">Product Features</h1>
          <p className="text-xl text-muted-foreground">
            Explore the core capabilities of the ayoAI platform, designed to bring powerful AI to your fingertips.
          </p>
        </header>

        <div className="space-y-16">
          {[
            {
              icon: MessageSquare,
              title: "Frontier Chat",
              description: "Engage in open-ended conversations, brainstorm ideas, draft content, and learn new subjects. Our chat model is optimized for nuance, accuracy, and helpfulness, drawing on extensive knowledge."
            },
            {
              icon: Terminal,
              title: "Code Interpreter",
              description: "A secure, sandboxed execution environment where the model can run Python code, analyze data, create charts, and solve complex mathematical problems iteratively."
            },
            {
              icon: Eye,
              title: "Multimodal Vision",
              description: "Upload images and documents. The model can analyze visual content, extract text from charts, describe scenes, and answer questions based on the visual context you provide."
            },
            {
              icon: FileSearch,
              title: "Document Search & Retrieval",
              description: "Seamlessly search across large repositories of documents. Our embeddings and vector search capabilities ensure you find relevant information quickly and accurately."
            }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-6 items-start p-8 bg-card border border-border rounded-3xl">
              <div className="p-4 bg-secondary rounded-2xl shrink-0">
                <feature.icon className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">{feature.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
