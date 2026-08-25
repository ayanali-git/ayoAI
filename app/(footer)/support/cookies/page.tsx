'use client';

export default function CookiesPage() {
  return (
    <div className="py-12 sm:py-16 w-full max-w-3xl mx-auto min-w-0">
      <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4 sm:mb-6">Cookie Policy</h1>
      <div className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">Last updated: August 23, 2026</div>

      <div className="space-y-8 sm:space-y-12 text-base sm:text-lg text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">What are cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences, keep your session secure, and understand how you interact with our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Types of cookies we use</h2>
          
          <div className="space-y-6 mt-4 sm:mt-6">
            <div>
              <h3 className="text-lg sm:text-xl font-medium text-foreground mb-1 sm:mb-2">Essential Cookies</h3>
              <p className="text-sm sm:text-base">Required for the website to function properly. These include authentication tokens, security measures, and load balancing cookies. You cannot opt out of these.</p>
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl font-medium text-foreground mb-1 sm:mb-2">Functional Cookies</h3>
              <p className="text-sm sm:text-base">Allow us to remember your preferences and settings, such as your UI state or language preferences.</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-medium text-foreground mb-1 sm:mb-2">Analytics Cookies</h3>
              <p className="text-sm sm:text-base">Help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this data to improve our services.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Managing your preferences</h2>
          <p className="mb-6 text-sm sm:text-base">
            You can manage your cookie preferences through your browser settings. Please note that disabling certain cookies may impact the functionality of our website.
          </p>
          <button className="px-6 py-3 bg-secondary text-foreground font-medium rounded-full hover:bg-border transition-colors text-sm sm:text-base">
            Manage Preferences
          </button>
        </section>
      </div>
    </div>
  );
}
