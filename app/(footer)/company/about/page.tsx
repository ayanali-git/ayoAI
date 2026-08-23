'use client';

import { Building2, Globe, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">About ayoAI</h1>
        <p className="text-xl text-muted-foreground mb-16 leading-relaxed">
          We are an AI research and deployment company dedicated to ensuring that artificial general intelligence benefits all of humanity.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our mission is to create safe and powerful AI systems and ensure they are broadly accessible. We believe that AI has the potential to help people solve some of the world's most intractable problems, and we are committed to building a platform that empowers individuals and organizations.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Core Principles</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              { icon: Zap, title: "Safety First", desc: "Rigorous alignment and safety research are foundational to our approach." },
              { icon: Globe, title: "Broad Benefit", desc: "Committed to using our influence to ensure AGI benefits everyone." },
              { icon: Building2, title: "Long-term Focus", desc: "We prioritize long-term safety and capabilities over short-term gains." },
              { icon: Users, title: "Collaboration", desc: "Working with the global research community to tackle grand challenges." }
            ].map((principle, i) => (
              <div key={i} className="p-6 bg-card border border-border rounded-2xl">
                <principle.icon className="h-6 w-6 mb-4 text-foreground" />
                <h3 className="text-lg font-medium mb-2">{principle.title}</h3>
                <p className="text-muted-foreground">{principle.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
