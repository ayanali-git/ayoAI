'use client';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">API Reference</h1>
          <p className="text-xl text-muted-foreground">
            Complete documentation for the ayoAI REST API. Learn how to authenticate, make requests, and integrate our models into your applications.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Authentication</h2>
          <p className="text-muted-foreground mb-4">
            All API requests require a Bearer token in the Authorization header. You can generate API keys in your dashboard.
          </p>
          <div className="bg-card border border-border rounded-xl p-4 overflow-x-auto text-sm font-mono">
            Authorization: Bearer YOUR_API_KEY
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Chat Completions</h2>
          <p className="text-muted-foreground mb-4">
            Creates a model response for the given chat conversation.
          </p>
          
          <h3 className="text-lg font-medium mb-3">Endpoint</h3>
          <div className="bg-card border border-border rounded-xl p-4 mb-6 font-mono text-sm">
            POST https://api.ayoai.example.com/v1/chat/completions
          </div>

          <h3 className="text-lg font-medium mb-3">Example Request</h3>
          <pre className="bg-card border border-border rounded-xl p-4 overflow-x-auto text-sm text-muted-foreground">
            <code>{`curl https://api.ayoai.example.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $AYOAI_API_KEY" \\
  -d '{
    "model": "frontier-chat-v1",
    "messages": [
      {
        "role": "user",
        "content": "Hello, world!"
      }
    ]
  }'`}</code>
          </pre>
        </section>
      </main>
    </div>
  );
}
