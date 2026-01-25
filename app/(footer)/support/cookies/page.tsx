'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Cookie, Calendar, Settings, Shield } from 'lucide-react';

const sections = [
    {
        title: '1. What Are Cookies?',
        content: `Cookies are small text files stored on your device when you visit websites. They help websites remember your preferences and improve your experience. ayoAI uses cookies and similar technologies (like local storage) to provide and secure our services.`
    },
    {
        title: '2. Types of Cookies We Use',
        content: `**Essential Cookies:**
These are necessary for the website to function properly. They enable core features like authentication and security. You cannot opt out of essential cookies.

**Functional Cookies:**
These remember your preferences such as language settings and theme choice (light/dark mode) to provide a personalized experience.

**Analytics Cookies:**
These help us understand how visitors interact with our website. We use this data to improve our services and user experience.

**Performance Cookies:**
These monitor website performance and help us identify issues to ensure fast, reliable service.`
    },
    {
        title: '3. Third-Party Cookies',
        content: `We may use third-party services that set their own cookies:

- **Authentication providers** for secure login
- **Payment processors** for secure transactions
- **Analytics services** to understand usage patterns

We carefully select partners who maintain high privacy standards.`
    },
    {
        title: '4. Managing Cookies',
        content: `You can control cookies through:

**Browser Settings:**
Most browsers let you block or delete cookies. Check your browser's help section for instructions.

**Our Cookie Settings:**
Use our cookie preferences panel (accessible via the settings icon in the footer) to customize your preferences.

**Note:** Blocking essential cookies may prevent ayoAI from functioning correctly.`
    },
    {
        title: '5. Cookie Duration',
        content: `**Session Cookies:**
Deleted when you close your browser.

**Persistent Cookies:**
Remain on your device for a set period or until you delete them. We use persistent cookies for preferences and authentication tokens.`
    },
    {
        title: '6. Updates to This Policy',
        content: `We may update this Cookie Policy periodically. Changes will be posted on this page with an updated effective date. Continued use of ayoAI after changes constitutes acceptance.`
    },
    {
        title: '7. Contact Us',
        content: `Questions about our cookie practices? Contact us at privacy@ayoai.com.`
    },
];

export default function CookiesPage() {
    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mb-4 px-4 py-1">
                        <Cookie className="w-4 h-4 mr-2" />Legal
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cookie Policy</h1>
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" /><span>Last Updated: January 1, 2026</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
                    <Card className="bg-[#12121a] border-white/5">
                        <CardContent className="p-8">
                            <p className="text-gray-400 leading-relaxed">
                                This Cookie Policy explains how ayoAI uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are, why we use them, and your rights to control our use of them.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.03 }}>
                            <Card className="bg-[#12121a] border-white/5">
                                <CardContent className="p-8">
                                    <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                                    <div className="text-gray-400 leading-relaxed whitespace-pre-line">
                                        {section.content.split('\n').map((p, i) => {
                                            if (p.startsWith('**') && p.endsWith('**')) return <p key={i} className="font-semibold text-white mt-4 mb-2">{p.replace(/\*\*/g, '')}</p>;
                                            if (p.startsWith('- ')) return <li key={i} className="ml-4 mb-1">{p.substring(2)}</li>;
                                            return p ? <p key={i} className="mb-2">{p}</p> : null;
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 text-center">
                    <Separator className="bg-white/5 mb-8" />
                    <p className="text-gray-500 text-sm">By using ayoAI, you consent to our use of cookies as described in this policy.</p>
                </motion.div>
            </div>
        </div>
    );
}
