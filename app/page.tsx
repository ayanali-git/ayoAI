'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  MessageCircle,
  Image,
  FileText,
  Zap,
  Users,
  Star,
  ChevronRight,
  Sparkles,
  Shield,
  Smartphone,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/ui/footer';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Conversations',
    description: 'Engage with advanced AI that understands context and provides intelligent responses.',
  },
  {
    icon: Image,
    title: 'Image Generation',
    description: 'Create stunning images from text descriptions or enhance existing photos.',
  },
  {
    icon: FileText,
    title: 'Document Analysis',
    description: 'Upload and analyze documents, PDFs, and various file formats.',
  },
  {
    icon: MessageCircle,
    title: 'Chat History',
    description: 'Access your previous conversations with search and organization features.',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Lightning-fast responses with 99.9% uptime guarantee.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected with enterprise-grade security.',
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '1M+', label: 'Conversations' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                ayoAI
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <Button asChild>
                  <Link href="/chat">
                    Go to Chat
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Now with Advanced AI
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-600 to-green-500 bg-clip-text text-transparent">
              Your AI-Powered
              <br />
              Assistant Awaits
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Interact with advanced AI using text, images, and documents. Generate stunning visuals,
              get intelligent answers, and boost your productivity like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Link href="/auth/signup">
                  Start Free Trial
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to supercharge your productivity with AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-muted">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include core features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <CardDescription>Perfect for trying out ayoAI</CardDescription>
                <div className="text-3xl font-bold">₹0</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    10 AI conversations/day
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    5 image generations/day
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Basic document analysis
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary shadow-lg relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Pro</CardTitle>
                <CardDescription>For power users and professionals</CardDescription>
                <div className="text-3xl font-bold">₹99</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Unlimited AI conversations
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    100 image generations/day
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Advanced document analysis
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Priority support
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600" asChild>
                  <Link href="/auth/signup?plan=pro">Choose Pro</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Ultra Pro Plan */}
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-xl">Ultra Pro</CardTitle>
                <CardDescription>For teams and heavy users</CardDescription>
                <div className="text-3xl font-bold">₹199</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Everything in Pro
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Unlimited image generations
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Team collaboration
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    API access
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/signup?plan=ultra">Choose Ultra Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already boosting their productivity with ayoAI
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/auth/signup">
                Start Your Free Trial
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}