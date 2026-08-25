'use client';

import { Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16 w-full max-w-4xl mx-auto min-w-0 px-4">
      <header className="mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4 sm:mb-6">Contact Us</h1>
        <p className="text-base sm:text-xl text-muted-foreground">
          Get in touch with the ayoAI team for support, press inquiries, or partnerships.
        </p>
      </header>

      <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Get in Touch</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
              <input id="name" type="text" className="w-full p-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input id="email" type="email" className="w-full p-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
              <textarea id="message" rows={5} className="w-full p-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" className="px-6 py-3 bg-foreground text-background font-medium rounded-full hover:opacity-90 transition-opacity text-sm">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Support & Inquiries</h2>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">General Support</div>
                  <div className="text-muted-foreground break-all">support@ayoai.example.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">Press & Media</div>
                  <div className="text-muted-foreground break-all">press@ayoai.example.com</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Office</h2>
            <div className="flex items-start gap-3 text-sm sm:text-base">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-muted-foreground">
                ayoAI Inc.<br />
                548 Market Street, Suite 48211<br />
                San Francisco, CA 94104
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
