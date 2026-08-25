'use client';

import { CheckCircle2 } from 'lucide-react';

export default function StatusPage() {
  return (
    <div className="py-12 sm:py-16 w-full max-w-4xl mx-auto min-w-0">
      <header className="mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4 sm:mb-6">System Status</h1>
        <p className="text-base sm:text-xl text-muted-foreground">
          Real-time status of ayoAI services and APIs.
        </p>
      </header>

      <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl mb-10 sm:mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-500 shrink-0" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">All Systems Operational</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Updated a few minutes ago</p>
          </div>
        </div>
        <div className="text-xs sm:text-sm font-medium px-3 py-1 bg-secondary rounded-full whitespace-nowrap">
          99.99% Uptime
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-base sm:text-lg font-semibold">Service Metrics</h3>
        {[
          { name: "Web Application", status: "Operational" },
          { name: "API endpoints", status: "Operational" },
          { name: "Model Inference", status: "Operational" },
          { name: "Billing & Accounts", status: "Operational" }
        ].map((service, i) => (
          <div key={i} className="flex items-center justify-between py-3.5 sm:py-4 border-b border-border/60 text-sm sm:text-base">
            <span className="font-medium text-foreground">{service.name}</span>
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span>
              {service.status}
            </span>
          </div>
        ))}
      </div>

      <section className="mt-12 sm:mt-16">
        <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Past Incidents</h3>
        <div className="text-muted-foreground text-sm sm:text-base">
          <p>No incidents reported in the last 30 days.</p>
        </div>
      </section>
    </div>
  );
}
