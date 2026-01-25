'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Send,
    Clock,
    Twitter,
    Linkedin,
    Github
} from 'lucide-react';

const contactMethods = [
    {
        icon: Mail,
        title: 'Email Us',
        description: 'Our team will respond within 24 hours',
        value: 'support@ayoai.com',
        href: 'mailto:support@ayoai.com'
    },
    {
        icon: Phone,
        title: 'Call Us',
        description: 'Mon-Fri from 9am to 6pm IST',
        value: '+91 1800-XXX-XXXX',
        href: 'tel:+911800XXXXXXX'
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        description: 'Come say hello at our office',
        value: 'Bangalore, Karnataka, India',
        href: '#'
    },
    {
        icon: MessageSquare,
        title: 'Live Chat',
        description: 'Chat with our support team',
        value: 'Start a conversation',
        href: '#'
    },
];

const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/ayoai', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/ayoai', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/ayoai', icon: Github },
];

const faqs = [
    {
        question: 'How quickly can I expect a response?',
        answer: 'We typically respond to all inquiries within 24 hours during business days.'
    },
    {
        question: 'Do you offer phone support?',
        answer: 'Yes, phone support is available for Pro and Ultra Pro subscribers during business hours.'
    },
    {
        question: 'Can I schedule a demo?',
        answer: 'Absolutely! Contact our sales team to schedule a personalized demo of ayoAI.'
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

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
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Us
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Get in{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Touch
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Have questions, feedback, or need assistance? We'd love to hear from you.
                    </p>
                </motion.div>

                {/* Contact Methods */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                >
                    {contactMethods.map((method, index) => (
                        <motion.a
                            key={method.title}
                            href={method.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="block"
                        >
                            <Card className="h-full bg-[#12121a] border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group">
                                <CardContent className="pt-6 text-center">
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                                        <method.icon className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{method.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{method.description}</p>
                                    <p className="text-sm text-purple-400 font-medium">{method.value}</p>
                                </CardContent>
                            </Card>
                        </motion.a>
                    ))}
                </motion.div>

                {/* Contact Form & Info */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-[#12121a] border-white/5">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Your Name
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Your Email
                                            </label>
                                            <Input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Subject
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Message
                                        </label>
                                        <Textarea
                                            placeholder="Tell us more about your inquiry..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 min-h-[150px]"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                    >
                                        {isSubmitting ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-8"
                    >
                        {/* Office Hours */}
                        <Card className="bg-[#12121a] border-white/5">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                                        <Clock className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Office Hours</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Monday - Friday</span>
                                        <span className="text-white">9:00 AM - 6:00 PM IST</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Saturday</span>
                                        <span className="text-white">10:00 AM - 4:00 PM IST</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Sunday</span>
                                        <span className="text-gray-500">Closed</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card className="bg-[#12121a] border-white/5">
                            <CardContent className="p-8">
                                <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                        >
                                            <social.icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick FAQs */}
                        <Card className="bg-[#12121a] border-white/5">
                            <CardContent className="p-8">
                                <h3 className="text-lg font-semibold text-white mb-4">Quick FAQs</h3>
                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <div key={index}>
                                            <h4 className="text-sm font-medium text-white mb-1">{faq.question}</h4>
                                            <p className="text-sm text-gray-500">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
