'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Brain, MessageCircle, Image, FileText, Zap, Shield, Sparkles, Globe, Smartphone, Code, Users, ChevronRight, Check } from 'lucide-react';

const mainFeatures = [
    {
        icon: Brain,
        title: 'AI-Powered Conversations',
        description: 'Engage in natural, context-aware conversations with our advanced AI. Get intelligent responses that understand nuance and provide helpful, accurate information.',
        highlights: ['Context-aware responses', 'Multi-turn conversations', 'Memory of chat history', 'Personalized interactions']
    },
    {
        icon: Image,
        title: 'Image Generation',
        description: 'Create stunning images from text descriptions. Our AI can generate artwork, illustrations, realistic photos, and creative visuals in seconds.',
        highlights: ['Text-to-image generation', 'Multiple art styles', 'High-resolution output', 'Quick iterations']
    },
    {
        icon: FileText,
        title: 'Document Analysis',
        description: 'Upload PDFs, documents, and images for intelligent analysis. Extract insights, summarize content, and ask questions about your files.',
        highlights: ['PDF & document support', 'Image text extraction', 'Smart summarization', 'Q&A on documents']
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Get responses in milliseconds with our optimized infrastructure. No waiting around - ayoAI is built for speed and efficiency.',
        highlights: ['Sub-second responses', 'Global CDN', 'Optimized models', '99.9% uptime']
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Your data is protected with end-to-end encryption and enterprise-grade security. We never train on your private conversations.',
        highlights: ['End-to-end encryption', 'SOC 2 compliant', 'Data privacy controls', 'Secure infrastructure']
    },
    {
        icon: Code,
        title: 'Developer API',
        description: 'Integrate ayoAI into your applications with our powerful REST API. Build custom solutions with comprehensive documentation.',
        highlights: ['RESTful API', 'SDK libraries', 'Webhook support', 'Rate limiting controls']
    },
];

const additionalFeatures = [
    { icon: Globe, title: 'Multi-language Support', description: 'Chat in 50+ languages' },
    { icon: Smartphone, title: 'Mobile Optimized', description: 'Works on any device' },
    { icon: MessageCircle, title: 'Chat History', description: 'Access past conversations' },
    { icon: Users, title: 'Team Collaboration', description: 'Share with your team' },
];

export default function FeaturesPage() {
    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mb-4 px-4 py-1">
                        <Sparkles className="w-4 h-4 mr-2" />Features
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Powerful AI,{' '}<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Simple to Use</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Everything you need to supercharge your productivity with cutting-edge AI capabilities.
                    </p>
                </motion.div>

                <div className="space-y-8 mb-16">
                    {mainFeatures.map((feature, index) => (
                        <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
                            <Card className="bg-card border-border hover:border-purple-500/30 transition-all overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="grid md:grid-cols-2 gap-8 items-center">
                                        <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                                    <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-foreground">{feature.title}</h2>
                                            </div>
                                            <p className="text-muted-foreground mb-6">{feature.description}</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {feature.highlights.map((h, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />{h}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={`h-48 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                                            <feature.icon className="w-20 h-20 text-purple-600/50 dark:text-purple-400/50" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground text-center mb-8">And Much More</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {additionalFeatures.map((f, i) => (
                            <Card key={i} className="bg-card border-border hover:border-purple-500/30 transition-all text-center">
                                <CardContent className="pt-6">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                                        <f.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="text-foreground font-medium mb-1">{f.title}</h3>
                                    <p className="text-sm text-muted-foreground">{f.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Card className="bg-gradient-to-br from-card to-muted border-purple-500/20">
                        <CardContent className="py-12 text-center">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">Join thousands of users already using ayoAI to boost productivity.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                    <Link href="/auth/signup">Start Free<ChevronRight className="w-4 h-4 ml-1" /></Link>
                                </Button>
                                <Button asChild variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                                    <Link href="/upgrade">View Pricing</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
