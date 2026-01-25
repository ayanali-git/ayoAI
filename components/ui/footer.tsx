'use client';

import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
    product: [
        { name: 'Features', href: '/product/features' },
        { name: 'Pricing', href: '/#pricing' },
        { name: 'API', href: '/product/api-docs' },
        { name: 'Documentation', href: '/product/docs' },
    ],
    company: [
        { name: 'About', href: '/company/about' },
        { name: 'Blog', href: '/company/blog' },
        { name: 'Careers', href: '/company/careers' },
        { name: 'Contact', href: '/company/contact' },
    ],
    support: [
        { name: 'Help Center', href: '/support/help' },
        { name: 'Privacy Policy', href: '/support/privacy' },
        { name: 'Terms of Service', href: '/support/terms' },
        { name: 'Status', href: '/support/status' },
    ],
};

const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/ayoai', icon: Twitter },
    { name: 'GitHub', href: 'https://github.com/ayoai', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/ayoai', icon: Linkedin },
    { name: 'Email', href: 'mailto:contact@ayoai.com', icon: Mail },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/5 bg-[#0a0a12] py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4 group">
                            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                ayoAI
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 mb-6 max-w-sm">
                            Your AI-powered assistant for the modern world. Chat, generate images, and analyze documents with advanced AI.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-500 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-500 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-500 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-white/5" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © {currentYear} ayoAI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/support/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link href="/support/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
                            Terms
                        </Link>
                        <Link href="/support/cookies" className="text-sm text-gray-500 hover:text-white transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
