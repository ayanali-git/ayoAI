'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Sparkles,
    Target,
    Heart,
    Lightbulb,
    Users,
    Globe,
    Rocket,
} from 'lucide-react';

const values = [
    {
        icon: Target,
        title: 'Mission-Driven',
        description: 'We\'re committed to making AI accessible and beneficial for everyone.'
    },
    {
        icon: Heart,
        title: 'User-Centric',
        description: 'Every feature we build starts with understanding user needs.'
    },
    {
        icon: Lightbulb,
        title: 'Innovation',
        description: 'We push boundaries to deliver cutting-edge AI capabilities.'
    },
    {
        icon: Users,
        title: 'Community',
        description: 'We grow together with our users and value their feedback.'
    },
];

const milestones = [
    { year: '2024', title: 'ayoAI Founded', description: 'Started with a vision to democratize AI' },
    { year: '2024', title: 'Beta Launch', description: 'Released our first public beta version' },
    { year: '2025', title: '50K Users', description: 'Reached 50,000 active users milestone' },
    { year: '2025', title: 'Pro Launch', description: 'Introduced Pro and Ultra Pro plans' },
];

const team = [
    { name: 'AI Research', count: '15+', description: 'AI & ML Engineers' },
    { name: 'Engineering', count: '25+', description: 'Full-stack Developers' },
    { name: 'Design', count: '8+', description: 'UX/UI Designers' },
    { name: 'Support', count: '12+', description: 'Customer Success' },
];

export default function AboutPage() {
    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mb-4 px-4 py-1">
                        <Sparkles className="w-4 h-4 mr-2" />
                        About ayoAI
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Building the Future of{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            AI Assistance
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        ayoAI is on a mission to make advanced AI accessible to everyone. We believe in empowering individuals and businesses with intelligent tools that enhance productivity and creativity.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-20"
                >
                    <Card className="bg-card border-border overflow-hidden">
                        <CardContent className="p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                            <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        To democratize access to advanced AI technology, enabling everyone to leverage the power of artificial intelligence in their daily lives and work. We strive to create intuitive, powerful, and ethical AI solutions that respect user privacy while delivering exceptional value.
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20">
                                            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        A world where AI enhances human potential without replacing human creativity. We envision ayoAI as the bridge between cutting-edge AI research and practical, everyday applications that anyone can use regardless of technical expertise.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <Card className="h-full bg-card border-border hover:border-purple-500/30 transition-all">
                                    <CardContent className="pt-6 text-center">
                                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                                            <value.icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                                        <p className="text-sm text-muted-foreground">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Timeline Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Journey</h2>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-purple-500/50 to-blue-500/50 hidden md:block" />
                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <Card className="inline-block bg-card border-border">
                                            <CardContent className="p-6">
                                                <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30 mb-2">
                                                    {milestone.year}
                                                </Badge>
                                                <h3 className="text-lg font-semibold text-foreground mb-1">{milestone.title}</h3>
                                                <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="hidden md:flex w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30" />
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Team Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Team</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map((dept, index) => (
                            <Card key={dept.name} className="bg-card border-border text-center">
                                <CardContent className="pt-6">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                                        {dept.count}
                                    </div>
                                    <div className="text-foreground font-medium mb-1">{dept.name}</div>
                                    <div className="text-sm text-muted-foreground">{dept.description}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
