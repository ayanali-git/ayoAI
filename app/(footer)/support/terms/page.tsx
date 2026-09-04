'use client';

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16 w-full max-w-3xl mx-auto min-w-0">
      <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4 sm:mb-6">Terms of Service</h1>
      <div className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">Last updated: August 23, 2026</div>

      <div className="space-y-8 sm:space-y-12 text-base sm:text-lg text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using the services provided by closeAI, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">2. Acceptable Use Policy</h2>
          <p className="mb-3 sm:mb-4">You agree not to use our services to:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
            <li>Generate illegal, harmful, or abusive content.</li>
            <li>Violate the intellectual property rights of others.</li>
            <li>Attempt to bypass security measures or rate limits.</li>
            <li>Develop competing models using our model outputs.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">3. Billing and Refunds</h2>
          <p>
            Subscription fees are billed in advance on a monthly or annual basis. All payments are non-refundable unless otherwise required by law. If you exceed your plan's usage limits, you may be subject to overage charges.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">4. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>
      </div>
    </div>
  );
}
