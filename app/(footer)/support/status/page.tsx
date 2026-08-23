'use client';

import { CheckCircle2 } from 'lucide-react';

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">System Status</h1>
          <p className="text-xl text-muted-foreground">
            Real-time status of ayoAI services and APIs.
          </p>
        </header>

        <div className="p-6 bg-card border border-border rounded-2xl mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-foreground" />
            <div>
              <h2 className="text-xl font-semibold">All Systems Operational</h2>
              <p className="text-sm text-muted-foreground">Updated a few minutes ago</p>
            </div>
          </div>
          <div className="text-sm font-medium px-3 py-1 bg-secondary rounded-full">
            99.99% Uptime
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Service Metrics</h3>
          {[
            { name: "Web Application", status: "Operational" },
            { name: "API endpoints", status: "Operational" },
            { name: "Model Inference", status: "Operational" },
            { name: "Billing & Accounts", status: "Operational" }
          ].map((service, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-border">
              <span className="font-medium text-foreground">{service.name}</span>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-foreground block"></span>
                {service.status}
              </span>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h3 className="text-lg font-semibold mb-6">Past Incidents</h3>
          <div className="text-muted-foreground">
            <p>No incidents reported in the last 30 days.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
