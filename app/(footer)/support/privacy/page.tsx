'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">Privacy Policy</h1>
        <div className="text-sm text-muted-foreground mb-12">Last updated: August 23, 2026</div>

        <div className="space-y-12 text-lg text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p>
              At ayoAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Data We Collect</h2>
            <p className="mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Payment and billing information</li>
              <li>Content you input into our models (prompts, uploaded files)</li>
              <li>Usage data and technical logs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Ownership and Training</h2>
            <p>
              You retain ownership of the data you input. By default, we do not use your API inputs or outputs to train our underlying models unless you explicitly opt-in. We employ strict data encryption in transit and at rest to protect your information.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies and Tracking</h2>
            <p>
              We use essential cookies to maintain your session and security. We may also use analytics cookies to understand how our services are used, which you can control through your browser settings or our Cookie Preferences page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
