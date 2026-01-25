'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Calendar } from 'lucide-react';

const sections = [
    {
        title: '1. Information We Collect',
        content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

**Personal Information:**
- Email address and name when you register
- Payment information when you subscribe to a paid plan
- Profile information you choose to provide

**Usage Information:**
- Chat conversations and queries you make to our AI
- Uploaded documents and images for analysis
- Device information, IP address, and browser type
- Usage patterns and feature interactions`
    },
    {
        title: '2. How We Use Your Information',
        content: `We use the information we collect to:

- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices, updates, and support messages
- Respond to your comments, questions, and requests
- Monitor and analyze trends, usage, and activities
- Detect, investigate, and prevent fraudulent transactions and abuse
- Personalize and improve your experience`
    },
    {
        title: '3. Information Sharing',
        content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:

- **Service Providers:** With third-party vendors who perform services on our behalf (e.g., payment processing, cloud hosting)
- **Legal Requirements:** When required by law or to respond to legal process
- **Protection:** To protect the rights, property, and safety of ayoAI, our users, or others
- **Business Transfers:** In connection with a merger, acquisition, or sale of assets

All service providers are contractually obligated to maintain the confidentiality and security of your information.`
    },
    {
        title: '4. Data Security',
        content: `We implement industry-standard security measures to protect your personal information:

- End-to-end encryption for sensitive data
- Secure HTTPS connections for all communications
- Regular security audits and vulnerability assessments
- Access controls and authentication mechanisms
- Encrypted database storage

While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`
    },
    {
        title: '5. Data Retention',
        content: `We retain your personal information for as long as necessary to:

- Provide our services to you
- Comply with legal obligations
- Resolve disputes and enforce agreements

**Chat History:** Retained for your convenience and can be deleted at any time from your settings.

**Account Data:** Retained until you delete your account. Upon deletion, we remove your personal data within 30 days.

**Backup Data:** May persist in encrypted backups for up to 90 days after deletion.`
    },
    {
        title: '6. Your Rights and Choices',
        content: `You have the following rights regarding your personal information:

- **Access:** Request a copy of the personal data we hold about you
- **Correction:** Request correction of inaccurate personal data
- **Deletion:** Request deletion of your personal data
- **Portability:** Request a copy of your data in a portable format
- **Opt-out:** Unsubscribe from marketing communications

To exercise these rights, please contact us at privacy@ayoai.com or through your account settings.`
    },
    {
        title: '7. Cookies and Tracking',
        content: `We use cookies and similar technologies to:

- Remember your preferences and settings
- Understand how you use our services
- Deliver relevant content and advertisements
- Measure the effectiveness of our communications

You can manage cookie preferences through your browser settings. Some features may not function properly if cookies are disabled.

For more details, please see our [Cookie Policy](/cookies).`
    },
    {
        title: '8. International Data Transfers',
        content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:

- Standard contractual clauses approved by relevant authorities
- Compliance with applicable data protection frameworks
- Data processing agreements with all service providers`
    },
    {
        title: '9. Children\'s Privacy',
        content: `ayoAI is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will take steps to delete it promptly.`
    },
    {
        title: '10. Changes to This Policy',
        content: `We may update this Privacy Policy from time to time. We will notify you of any changes by:

- Posting the new policy on this page
- Updating the "Last Updated" date
- Sending an email notification for material changes

Your continued use of ayoAI after changes constitutes acceptance of the updated policy.`
    },
    {
        title: '11. Contact Us',
        content: `If you have questions about this Privacy Policy or our data practices, please contact us:

**Email:** privacy@ayoai.com
**Address:** ayoAI Technologies Pvt. Ltd., Bangalore, Karnataka, India

We will respond to your inquiry within 30 days.`
    },
];

export default function PrivacyPage() {
    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mb-4 px-4 py-1">
                        <Shield className="w-4 h-4 mr-2" />
                        Legal
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Privacy Policy
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Last Updated: January 1, 2026</span>
                    </div>
                </motion.div>

                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <Card className="bg-card border-border">
                        <CardContent className="p-8">
                            <p className="text-muted-foreground leading-relaxed">
                                At ayoAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered assistant platform. Please read this policy carefully to understand our practices regarding your personal data.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Policy Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.03 }}
                        >
                            <Card className="bg-card border-border">
                                <CardContent className="p-8">
                                    <h2 className="text-xl font-bold text-foreground mb-4">{section.title}</h2>
                                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {section.content.split('\n').map((paragraph, i) => {
                                            // Helper to format inline bold text
                                            const formatText = (text: string) => {
                                                const parts = text.split(/(\*\*.*?\*\*)/g);
                                                return parts.map((part, index) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={index} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
                                                    }
                                                    return part;
                                                });
                                            };

                                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                                return (
                                                    <p key={i} className="font-semibold text-foreground mt-4 mb-2">
                                                        {paragraph.slice(2, -2)}
                                                    </p>
                                                );
                                            }
                                            if (paragraph.startsWith('- ')) {
                                                return (
                                                    <li key={i} className="ml-4 mb-1">
                                                        {formatText(paragraph.substring(2))}
                                                    </li>
                                                );
                                            }
                                            return paragraph ? <p key={i} className="mb-2">{formatText(paragraph)}</p> : null;
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <Separator className="bg-white/5 mb-8" />
                    <p className="text-muted-foreground text-sm">
                        By using ayoAI, you acknowledge that you have read and understood this Privacy Policy.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
