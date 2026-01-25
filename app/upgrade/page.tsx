'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Crown,
  Check,
  Sparkles,
  Zap,
  Users,
  Shield,
  MessageCircle,
  Image,
  FileText,
  Headphones,
  Infinity as InfinityIcon,
  Star
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
      { text: 'Community support', included: true },
      { text: 'Priority access', included: false },
      { text: 'API access', included: false },
    ],
    popular: false,
    icon: MessageCircle,
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
      { text: 'Priority email support', included: true },
      { text: 'Priority access to new features', included: true },
      { text: 'API access', included: false },
    ],
    popular: true,
    icon: Zap,
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
      { text: 'Early access to beta features', included: true },
      { text: 'Full API access', included: true },
    ],
    popular: false,
    icon: Crown,
  },
];

const faqs = [
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, UPI, and net banking for Indian users.',
  },
  {
    question: 'Is there a refund policy?',
    answer: 'Yes, we offer a 7-day money-back guarantee if you are not satisfied with your subscription.',
  },
  {
    question: 'Do unused credits roll over?',
    answer: 'Daily limits reset every 24 hours and do not roll over to the next day.',
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);

  const currentPlan = user?.user_metadata?.plan || 'free';

  const handleUpgrade = (planId: string) => {
    if (planId === 'ultra') {
      // Contact sales for ultra plan
      window.open('mailto:sales@ayoai.com?subject=Ultra Pro Plan Inquiry', '_blank');
    } else if (planId === 'pro') {
      // TODO: Integrate with payment gateway
      alert('Payment integration coming soon! You will be redirected to our payment gateway.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a12]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/5"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Chat
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mb-4 px-4 py-1">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Your Plan
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Unlock More with{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ayoAI Pro
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs and boost your productivity with advanced AI capabilities.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-500'}`}>
              Yearly
              <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                Save 15%
              </Badge>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => {
            const isCurrentPlan = currentPlan === plan.id;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full bg-[#12121a] border-white/5 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${plan.popular
                  ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
                  : 'hover:border-white/10'
                  }`}>
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 rounded-t-none">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className={`${plan.popular ? 'pt-10' : 'pt-6'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2.5 rounded-xl ${plan.id === 'free'
                        ? 'bg-gray-500/10'
                        : plan.id === 'pro'
                          ? 'bg-blue-500/10'
                          : 'bg-purple-500/10'
                        }`}>
                        <Icon className={`w-5 h-5 ${plan.id === 'free'
                          ? 'text-gray-400'
                          : plan.id === 'pro'
                            ? 'text-blue-400'
                            : 'text-purple-400'
                          }`} />
                      </div>
                      <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-500">{plan.description}</CardDescription>

                    {/* Price */}
                    <div className="mt-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">₹{price}</span>
                        <span className="text-gray-500">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </div>
                      {isYearly && price > 0 && (
                        <p className="text-sm text-green-400 mt-1">
                          Save ₹{(plan.monthlyPrice * 12) - plan.yearlyPrice} yearly
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4">
                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feature.included
                            ? 'bg-green-500/20'
                            : 'bg-gray-500/10'
                            }`}>
                            <Check className={`w-3 h-3 ${feature.included
                              ? 'text-green-400'
                              : 'text-gray-600'
                              }`} />
                          </div>
                          <span className={`text-sm ${feature.included
                            ? 'text-gray-300'
                            : 'text-gray-600'
                            }`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    {isCurrentPlan ? (
                      <Button
                        className="w-full bg-white/5 text-gray-400 cursor-default"
                        disabled
                      >
                        Current Plan
                      </Button>
                    ) : plan.id === 'free' ? (
                      <Button
                        variant="outline"
                        className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                        disabled
                      >
                        Free Forever
                      </Button>
                    ) : (
                      <Button
                        className={`w-full ${plan.popular
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {plan.id === 'ultra' ? 'Contact Sales' : 'Upgrade to Pro'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Why Upgrade to Pro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: InfinityIcon, title: 'Unlimited Chats', desc: 'No daily limits on conversations' },
              { icon: Image, title: 'More Images', desc: 'Generate up to 100 images daily' },
              { icon: Zap, title: 'Faster Response', desc: 'Priority processing for your requests' },
              { icon: Headphones, title: 'Priority Support', desc: 'Get help when you need it' },
            ].map((item, index) => (
              <Card key={index} className="bg-[#12121a] border-white/5 hover:border-purple-500/30 transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-[#12121a] border-white/5">
                <CardContent className="pt-6">
                  <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-500">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="text-sm">7-Day Refund</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}