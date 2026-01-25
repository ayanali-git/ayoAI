'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Briefcase,
    MapPin,
    Clock,
    ChevronRight,
    Heart,
    Coffee,
    Laptop,
    Users,
    Plane,
    GraduationCap,
    Sparkles,
    Building
} from 'lucide-react';

const benefits = [
    { icon: Heart, title: 'Health Insurance', description: 'Comprehensive health coverage for you and family' },
    { icon: Coffee, title: 'Free Meals', description: 'Healthy meals and snacks at the office' },
    { icon: Laptop, title: 'Remote Friendly', description: 'Work from anywhere, anytime' },
    { icon: Users, title: 'Team Events', description: 'Regular team outings and celebrations' },
    { icon: Plane, title: 'Paid Time Off', description: 'Generous vacation and personal days' },
    { icon: GraduationCap, title: 'Learning Budget', description: 'Annual allowance for courses and conferences' },
];

const openPositions = [
    {
        title: 'Senior AI/ML Engineer',
        department: 'Engineering',
        location: 'Remote / Bangalore',
        type: 'Full-time',
        experience: '5+ years',
        description: 'Lead the development of our core AI models and help improve response quality.'
    },
    {
        title: 'Full Stack Developer',
        department: 'Engineering',
        location: 'Remote / Bangalore',
        type: 'Full-time',
        experience: '3+ years',
        description: 'Build and maintain our web platform using Next.js, React, and Node.js.'
    },
    {
        title: 'Senior Product Designer',
        department: 'Design',
        location: 'Remote',
        type: 'Full-time',
        experience: '4+ years',
        description: 'Shape the future of AI interaction through intuitive and beautiful designs.'
    },
    {
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'Remote / Bangalore',
        type: 'Full-time',
        experience: '3+ years',
        description: 'Scale our infrastructure to handle millions of AI requests daily.'
    },
    {
        title: 'Customer Success Manager',
        department: 'Support',
        location: 'Remote',
        type: 'Full-time',
        experience: '2+ years',
        description: 'Help our Pro and Ultra Pro customers get the most out of ayoAI.'
    },
    {
        title: 'Technical Writer',
        department: 'Documentation',
        location: 'Remote',
        type: 'Full-time / Part-time',
        experience: '2+ years',
        description: 'Create clear and comprehensive documentation for our platform and API.'
    },
];

const cultureValues = [
    { title: 'Move Fast', description: 'We ship quickly and iterate based on feedback' },
    { title: 'Think Big', description: 'We tackle ambitious problems that matter' },
    { title: 'Stay Curious', description: 'We never stop learning and experimenting' },
    { title: 'Be Human', description: 'We value empathy, honesty, and collaboration' },
];

export default function CareersPage() {
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
                        <Briefcase className="w-4 h-4 mr-2" />
                        Careers at ayoAI
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Build the Future of{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            AI With Us
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Join a passionate team of builders, dreamers, and innovators working to make AI accessible to everyone.
                    </p>
                    <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <a href="#openings">
                            View Open Positions
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </a>
                    </Button>
                </motion.div>

                {/* Culture Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold text-foreground text-center mb-4">Our Culture</h2>
                    <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                        We believe great products come from great teams. Here's what we value.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cultureValues.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <Card className="h-full bg-card border-border hover:border-purple-500/30 transition-all text-center">
                                    <CardContent className="pt-6">
                                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                                        <p className="text-sm text-muted-foreground">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold text-foreground text-center mb-4">Perks & Benefits</h2>
                    <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                        We take care of our team so they can focus on building amazing things.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                            >
                                <Card className="bg-card border-border hover:border-purple-500/30 transition-all">
                                    <CardContent className="pt-6 flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex-shrink-0">
                                            <benefit.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-foreground font-medium mb-1">{benefit.title}</h3>
                                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Open Positions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    id="openings"
                    className="scroll-mt-24"
                >
                    <h2 className="text-3xl font-bold text-foreground text-center mb-4">Open Positions</h2>
                    <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                        Find your perfect role and help us shape the future of AI.
                    </p>
                    <div className="space-y-4">
                        {openPositions.map((position, index) => (
                            <motion.div
                                key={position.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.05 }}
                            >
                                <Card className="bg-card border-border hover:border-purple-500/30 transition-all cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                                                        {position.title}
                                                    </h3>
                                                    <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
                                                        {position.department}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">{position.description}</p>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {position.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {position.type}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Briefcase className="w-4 h-4" />
                                                        {position.experience}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="bg-secondary text-foreground hover:bg-secondary/80 w-full lg:w-auto">
                                                Apply Now
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16"
                >
                    <Card className="bg-gradient-to-br from-card to-muted border-purple-500/20">
                        <CardContent className="py-12 text-center">
                            <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-foreground mb-4">Don't See the Right Role?</h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
                            </p>
                            <Button asChild variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                                <a href="mailto:careers@ayoai.com">
                                    Send Your Resume
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
