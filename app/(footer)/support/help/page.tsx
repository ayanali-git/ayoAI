'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
    HelpCircle,
    Search,
    MessageCircle,
    Mail,
    FileText,
    Zap,
    CreditCard,
    Settings,
    Shield,
    ChevronDown,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

const categories = [
    {
        icon: Zap,
        title: 'Getting Started',
        description: 'Learn the basics of using ayoAI',
        articles: 8
    },
    {
        icon: MessageCircle,
        title: 'Chat & Conversations',
        description: 'Tips for effective AI conversations',
        articles: 12
    },
    {
        icon: FileText,
        title: 'Document Analysis',
        description: 'Upload and analyze files',
        articles: 6
    },
    {
        icon: CreditCard,
        title: 'Billing & Plans',
        description: 'Manage your subscription',
        articles: 10
    },
    {
        icon: Settings,
        title: 'Account Settings',
        description: 'Configure your preferences',
        articles: 7
    },
    {
        icon: Shield,
        title: 'Privacy & Security',
        description: 'Keep your data safe',
        articles: 5
    },
];

const faqs = [
    {
        question: 'How do I start a new conversation with ayoAI?',
        answer: 'Simply click on "New Chat" in the sidebar or press Ctrl/Cmd + N. You can then type your message and press Enter to start chatting with the AI.'
    },
    {
        question: 'What file formats can I upload for analysis?',
        answer: 'ayoAI supports PDF, DOCX, TXT, and common image formats (JPG, PNG, GIF, WebP). Max file size is 10MB for free users and 50MB for Pro subscribers.'
    },
    {
        question: 'How many images can I generate per day?',
        answer: 'Free users can generate up to 5 images per day. Pro users get 100 images/day, and Ultra Pro users have unlimited generations.'
    },
    {
        question: 'How do I upgrade my plan?',
        answer: 'Go to Settings > Billing or visit the Upgrade page. You can choose between monthly and yearly billing with up to 15% savings on annual plans.'
    },
    {
        question: 'Is my conversation data stored?',
        answer: 'Yes, conversations are stored securely to provide you with chat history. You can delete individual conversations or all data from Settings > Privacy.'
    },
    {
        question: 'Can I use ayoAI on mobile devices?',
        answer: 'Yes! ayoAI is fully responsive and works great on mobile browsers. Native iOS and Android apps are coming soon.'
    },
    {
        question: 'How do I contact support?',
        answer: 'You can reach us via email at support@ayoai.com, through live chat (Pro users), or by submitting a ticket from the Contact page.'
    },
    {
        question: 'What happens if I exceed my daily limits?',
        answer: 'You\'ll see a notification and can either wait for the limit to reset at midnight UTC or upgrade to a higher plan for more capacity.'
    },
];

const popularArticles = [
    'How to write effective prompts for better AI responses',
    'Understanding your usage dashboard and limits',
    'Setting up two-factor authentication',
    'Exporting your conversation history',
    'Integrating ayoAI with other tools via API'
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mb-4 px-4 py-1">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Help Center
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        How Can We{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Help You?
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Find answers, guides, and resources to help you get the most out of ayoAI.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search for help articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 py-6 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500/50 text-lg"
                        />
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Browse by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                            >
                                <Card className="h-full bg-card border-border hover:border-purple-500/30 transition-all cursor-pointer group">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                                                <category.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                                                    {category.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                                                <span className="text-xs text-purple-600 dark:text-purple-400">{category.articles} articles</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.03 }}
                            >
                                <Card
                                    className="bg-card border-border hover:border-purple-500/30 transition-all cursor-pointer"
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-foreground font-medium pr-4">{faq.question}</h3>
                                            <ChevronDown
                                                className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </div>
                                        {expandedFaq === index && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="text-muted-foreground text-sm mt-4 pt-4 border-t border-border"
                                            >
                                                {faq.answer}
                                            </motion.p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Popular Articles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-16"
                >
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Popular Articles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {popularArticles.map((article, index) => (
                                    <li key={index}>
                                        <a
                                            href="#"
                                            className="flex items-center gap-3 text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                                        >
                                            <FileText className="w-4 h-4 flex-shrink-0" />
                                            <span className="flex-1">{article}</span>
                                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contact Support CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="bg-gradient-to-br from-card to-muted border-purple-500/20">
                        <CardContent className="py-12 text-center">
                            <MessageCircle className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-foreground mb-4">Still Need Help?</h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                Our support team is ready to assist you with any questions or issues.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                    <Link href="/contact">
                                        Contact Support
                                        <Mail className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Start Live Chat
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
