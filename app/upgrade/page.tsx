'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/components/subscription-provider';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import {
  ChevronLeft,
  Check,
  Shield,
  Loader
} from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out ayoAI',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: '10 AI conversations/day', included: true },
      { text: '5 image generations/day', included: true },
      { text: 'Basic document analysis', included: true },
      { text: 'Standard response speed', included: true },
      { text: 'Priority access', included: false },
      { text: 'API access', included: false },
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users and professionals',
    monthlyPrice: 99,
    yearlyPrice: 999,
    features: [
      { text: 'Unlimited AI conversations', included: true },
      { text: '100 image generations/day', included: true },
      { text: 'Advanced document analysis', included: true },
      { text: 'Faster response speed', included: true },
      { text: 'Priority support', included: true },
      { text: 'API access', included: false },
    ],
    popular: true,
  },
  {
    id: 'ultra',
    name: 'Ultra Pro',
    description: 'For teams and heavy users',
    monthlyPrice: 199,
    yearlyPrice: 1999,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited image generations', included: true },
      { text: 'Team collaboration tools', included: true },
      { text: 'Fastest response speed', included: true },
      { text: '24/7 priority support', included: true },
      { text: 'Full API access', included: true },
    ],
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, UPI, and net banking.',
  },
  {
    question: 'Is there a refund policy?',
    answer: 'Yes, we offer a 7-day money-back guarantee if you are not satisfied with your subscription.',
  },
  {
    question: 'Do unused limits roll over?',
    answer: 'Daily limits reset every 24 hours and do not roll over to the next day.',
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { plan: currentPlan, hasActiveSubscription, refreshSubscription } = useSubscription();
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const hasProcessedSuccess = useRef(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true' && !hasProcessedSuccess.current) {
      hasProcessedSuccess.current = true;
      toast.success('Subscription successful! Your plan has been upgraded.');

      let attempts = 0;
      const maxAttempts = 10;
      const pollInterval = setInterval(async () => {
        await refreshSubscription();
        attempts++;

        if (currentPlan !== 'free' || attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setShowSuccessModal(true);
        }
      }, 1000);

      router.replace('/upgrade');
      return () => clearInterval(pollInterval);
    } else if (canceled === 'true' && !hasProcessedSuccess.current) {
      hasProcessedSuccess.current = true;
      toast.error('Checkout was canceled.');
      router.replace('/upgrade');
    }
  }, [searchParams, router, refreshSubscription, currentPlan]);

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast.error('Please login to upgrade your plan');
      router.push('/auth/login');
      return;
    }

    setLoading(planId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Session expired. Please login again.');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plan: planId,
          interval: isYearly ? 'yearly' : 'monthly',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoading('manage');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Session expired. Please login again.');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open subscription portal');
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error('Portal error:', error);
      toast.error(error.message || 'Failed to open subscription portal');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => router.push('/c')}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Chat
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Upgrade your plan
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose the plan that best fits your workflow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Yearly
              <span className="ml-1.5 text-xs text-neutral-500 font-normal">
                (Save 15%)
              </span>
            </span>
          </div>

          {hasActiveSubscription && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageSubscription}
                disabled={loading === 'manage'}
              >
                {loading === 'manage' ? 'Loading...' : 'Manage Subscription'}
              </Button>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col justify-between p-8 rounded-2xl bg-card transition-colors ${
                  plan.popular
                    ? 'border-2 border-foreground'
                    : 'border border-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">{plan.name}</CardTitle>
                    {plan.popular && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm text-muted-foreground mb-6">
                    {plan.description}
                  </CardDescription>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-foreground">₹{price}</span>
                      <span className="text-sm text-muted-foreground">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check
                          className={`w-4 h-4 flex-shrink-0 ${
                            feature.included ? 'text-foreground' : 'text-neutral-300'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            feature.included ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {isCurrentPlan ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-full cursor-default text-muted-foreground"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : plan.id === 'free' ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-full text-muted-foreground"
                      disabled
                    >
                      Free
                    </Button>
                  ) : (
                    <Button
                      className={`w-full rounded-full ${
                        plan.popular
                          ? 'bg-primary text-primary-foreground hover:opacity-90'
                          : 'bg-secondary text-foreground hover:bg-neutral-200'
                      }`}
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={loading !== null}
                    >
                      {loading === plan.id ? (
                        <><Loader className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-xl font-semibold text-foreground text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-2xl p-6">
                <h3 className="text-sm font-medium text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-border pt-8 flex items-center justify-center gap-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Secure payment via Stripe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>7-day money-back guarantee</span>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              Welcome to {currentPlan === 'ultra' ? 'Ultra Pro' : 'Pro'}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Your subscription is now active. You have full access to upgraded features.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Button
              className="w-full rounded-full"
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/c');
              }}
            >
              Start Asking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}