'use client';

import { Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with the ayoAI team for support, press inquiries, or partnerships.
          </p>
        </header>

        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                <input id="name" type="text" className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <input id="email" type="email" className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                <textarea id="message" rows={5} className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Support & Inquiries</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">General Support</div>
                    <div className="text-muted-foreground">support@ayoai.example.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Press & Media</div>
                    <div className="text-muted-foreground">press@ayoai.example.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Office</h2>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-muted-foreground">
                  ayoAI Headquarters<br />
                  123 AI Boulevard<br />
                  San Francisco, CA 94105<br />
                  United States
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
