'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, Rocket, MessageCircle, Image, FileText, Settings, Shield, Zap, ChevronRight, ExternalLink } from 'lucide-react';

const guides = [
    {
        icon: Rocket,
        title: 'Getting Started',
        description: 'Learn the basics of ayoAI and set up your account in minutes.',
        articles: [
            { title: 'Creating Your Account', href: '#' },
            { title: 'Understanding the Dashboard', href: '#' },
            { title: 'Your First AI Conversation', href: '#' },
            { title: 'Navigating the Interface', href: '#' },
        ]
    },
    {
        icon: MessageCircle,
        title: 'Chat & Conversations',
        description: 'Master the art of effective AI conversations.',
        articles: [
            { title: 'Writing Effective Prompts', href: '#' },
            { title: 'Using Context for Better Responses', href: '#' },
            { title: 'Managing Chat History', href: '#' },
            { title: 'Conversation Best Practices', href: '#' },
        ]
    },
    {
        icon: Image,
        title: 'Image Generation',
        description: 'Create stunning visuals with AI-powered image generation.',
        articles: [
            { title: 'Image Generation Basics', href: '#' },
            { title: 'Prompt Techniques for Better Images', href: '#' },
            { title: 'Supported Styles and Formats', href: '#' },
            { title: 'Downloading and Sharing Images', href: '#' },
        ]
    },
    {
        icon: FileText,
        title: 'Document Analysis',
        description: 'Extract insights from your documents and files.',
        articles: [
            { title: 'Uploading Documents', href: '#' },
            { title: 'Supported File Formats', href: '#' },
            { title: 'Asking Questions About Documents', href: '#' },
            { title: 'Summarizing Long Documents', href: '#' },
        ]
    },
    {
        icon: Settings,
        title: 'Account & Settings',
        description: 'Customize ayoAI to work the way you want.',
        articles: [
            { title: 'Managing Your Profile', href: '#' },
            { title: 'Subscription & Billing', href: '#' },
            { title: 'API Key Management', href: '#' },
            { title: 'Notification Preferences', href: '#' },
        ]
    },
    {
        icon: Shield,
        title: 'Privacy & Security',
        description: 'Keep your data safe and understand our practices.',
        articles: [
            { title: 'Data Privacy Overview', href: '#' },
            { title: 'Two-Factor Authentication', href: '#' },
            { title: 'Deleting Your Data', href: '#' },
            { title: 'Security Best Practices', href: '#' },
        ]
    },
];

const quickLinks = [
    { icon: Zap, title: 'API Reference', description: 'Technical API documentation', href: '/api-docs' },
    { icon: BookOpen, title: 'Release Notes', description: 'Latest updates and changes', href: '#' },
    { icon: MessageCircle, title: 'Community Forum', description: 'Get help from other users', href: '#' },
];

export default function DocsPage() {
    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mb-4 px-4 py-1">
                        <BookOpen className="w-4 h-4 mr-2" />Documentation
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">ayoAI Docs</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Everything you need to know about using ayoAI effectively.
                    </p>
                </motion.div>

                {/* Quick Links */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-3 gap-4 mb-12">
                    {quickLinks.map((link, i) => (
                        <Link key={i} href={link.href}>
                            <Card className="bg-[#12121a] border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group h-full">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                                        <link.icon className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium group-hover:text-purple-300 transition-colors">{link.title}</h3>
                                        <p className="text-sm text-gray-500">{link.description}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </motion.div>

                {/* Guides Grid */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-2xl font-bold text-white mb-6">Guides & Tutorials</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {guides.map((guide, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                                <Card className="h-full bg-[#12121a] border-white/5 hover:border-purple-500/30 transition-all">
                                    <CardHeader>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                                                <guide.icon className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <CardTitle className="text-lg text-white">{guide.title}</CardTitle>
                                        </div>
                                        <p className="text-sm text-gray-500">{guide.description}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {guide.articles.map((article, j) => (
                                                <li key={j}>
                                                    <a href={article.href} className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors group">
                                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span>{article.title}</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
                    <Card className="bg-gradient-to-br from-[#12121a] to-[#1a1a2e] border-purple-500/20">
                        <CardContent className="py-8 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Can't Find What You're Looking For?</h3>
                            <p className="text-gray-400 mb-4">Our support team is here to help you with any questions.</p>
                            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                <Link href="/contact">Contact Support<ChevronRight className="w-4 h-4 ml-1" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
