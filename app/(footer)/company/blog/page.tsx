'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    BookOpen,
    Calendar,
    Clock,
    ChevronRight,
    TrendingUp,
    Sparkles,
    Lightbulb,
    Zap
} from 'lucide-react';

const featuredPost = {
    title: 'Introducing ayoAI 2.0: The Future of AI Assistance',
    excerpt: 'We\'re excited to announce the biggest update to ayoAI yet. With enhanced AI models, faster response times, and new creative capabilities, ayoAI 2.0 is designed to supercharge your productivity.',
    category: 'Product Updates',
    date: 'Jan 20, 2026',
    readTime: '5 min read',
    image: 'gradient'
};

const posts = [
    {
        title: 'How to Use AI for Document Analysis',
        excerpt: 'Learn how to leverage ayoAI\'s document analysis features to extract insights from PDFs, images, and more.',
        category: 'Tutorials',
        date: 'Jan 18, 2026',
        readTime: '4 min read',
        icon: BookOpen
    },
    {
        title: 'The Power of AI Image Generation',
        excerpt: 'Discover tips and tricks for creating stunning images with ayoAI\'s advanced image generation capabilities.',
        category: 'Tips & Tricks',
        date: 'Jan 15, 2026',
        readTime: '6 min read',
        icon: Sparkles
    },
    {
        title: '10 Ways to Boost Your Productivity with AI',
        excerpt: 'Explore practical strategies to integrate AI into your daily workflow and accomplish more in less time.',
        category: 'Productivity',
        date: 'Jan 12, 2026',
        readTime: '7 min read',
        icon: Zap
    },
    {
        title: 'Understanding Large Language Models',
        excerpt: 'A beginner-friendly guide to how LLMs work and why they\'re revolutionizing the way we interact with technology.',
        category: 'Education',
        date: 'Jan 10, 2026',
        readTime: '8 min read',
        icon: Lightbulb
    },
    {
        title: 'ayoAI API: Getting Started Guide',
        excerpt: 'Everything you need to know to integrate ayoAI\'s powerful API into your applications.',
        category: 'Developers',
        date: 'Jan 8, 2026',
        readTime: '10 min read',
        icon: TrendingUp
    },
    {
        title: 'Privacy-First AI: Our Commitment to You',
        excerpt: 'Learn about the security measures and privacy practices that keep your data safe when using ayoAI.',
        category: 'Security',
        date: 'Jan 5, 2026',
        readTime: '4 min read',
        icon: BookOpen
    },
];

const categories = [
    'All Posts',
    'Product Updates',
    'Tutorials',
    'Tips & Tricks',
    'Productivity',
    'Developers',
    'Education',
    'Security'
];

export default function BlogPage() {
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
                        <BookOpen className="w-4 h-4 mr-2" />
                        ayoAI Blog
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Insights & Updates
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Stay up to date with the latest AI trends, product updates, tutorials, and tips from the ayoAI team.
                    </p>
                </motion.div>

                {/* Category Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-2 mb-12"
                >
                    {categories.map((category, index) => (
                        <Button
                            key={category}
                            variant={index === 0 ? 'default' : 'outline'}
                            size="sm"
                            className={index === 0
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }
                        >
                            {category}
                        </Button>
                    ))}
                </motion.div>

                {/* Featured Post */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <Card className="bg-gradient-to-br from-card to-muted border-border overflow-hidden hover:border-purple-500/30 transition-all cursor-pointer group">
                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="h-64 md:h-auto bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                <Sparkles className="w-24 h-24 text-purple-600/50 dark:text-purple-400/50 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                            </div>
                            <CardContent className="p-8 flex flex-col justify-center">
                                <Badge className="w-fit bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30 mb-4">
                                    {featuredPost.category}
                                </Badge>
                                <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {featuredPost.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {featuredPost.readTime}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                </motion.div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                        >
                            <Card className="h-full bg-card border-border hover:border-purple-500/30 transition-all cursor-pointer group">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                                        <post.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <Badge className="w-fit bg-secondary text-muted-foreground border-border mb-2">
                                        {post.category}
                                    </Badge>
                                    <CardTitle className="text-lg text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                                        {post.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Load More */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                        Load More Posts
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </motion.div>

                {/* Newsletter CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16"
                >
                    <Card className="bg-gradient-to-br from-card via-muted to-card border-purple-500/20">
                        <CardContent className="py-12 text-center">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Subscribe to Our Newsletter</h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                Get the latest updates, tips, and insights delivered straight to your inbox.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50"
                                />
                                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                    Subscribe
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
