'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar } from 'lucide-react';

const sections = [
    {
        title: '1. Acceptance of Terms',
        content: `By accessing or using ayoAI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.

These Terms apply to all visitors, users, and others who access or use the Service. By using ayoAI, you represent that you are at least 13 years old and have the legal capacity to enter into these Terms.`
    },
    {
        title: '2. Description of Service',
        content: `ayoAI is an AI-powered assistant platform that provides:

- Natural language conversation capabilities
- Image generation and analysis
- Document processing and analysis
- Various AI-powered productivity tools

The Service is provided "as is" and we reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.`
    },
    {
        title: '3. User Accounts',
        content: `**Account Creation:**
- You must provide accurate and complete information
- You are responsible for maintaining account security
- You must notify us immediately of any unauthorized access

**Account Responsibilities:**
- One person may not maintain multiple free accounts
- You may not share your account credentials with others
- You are responsible for all activities under your account`
    },
    {
        title: '4. Acceptable Use',
        content: `You agree NOT to use ayoAI to:

- Violate any applicable laws or regulations
- Generate content that is illegal, harmful, or offensive
- Infringe upon intellectual property rights of others
- Attempt to reverse engineer or extract source code
- Interfere with or disrupt the Service's infrastructure
- Impersonate another person or entity
- Engage in automated data collection without permission
- Circumvent usage limits or restrictions
- Generate spam, malware, or phishing content
- Create content depicting minors in harmful situations`
    },
    {
        title: '5. Content and Intellectual Property',
        content: `**Your Content:**
- You retain ownership of content you create using ayoAI
- You grant us a license to process your content to provide the Service
- You are responsible for ensuring you have rights to any uploaded content

**AI-Generated Content:**
- AI-generated outputs may be used by you for personal or commercial purposes
- You acknowledge AI outputs may not be unique and similar outputs may be generated for others
- You are responsible for reviewing and verifying AI-generated content before use

**Our Content:**
- ayoAI's name, logo, and branding are our trademarks
- The Service's software and technology are our intellectual property
- You may not copy, modify, or distribute our proprietary content`
    },
    {
        title: '6. Subscription and Payment',
        content: `**Free Tier:**
- Limited features and usage quotas apply
- We may modify free tier limits at any time

**Paid Plans:**
- Subscription fees are billed in advance on a monthly or yearly basis
- Prices are in Indian Rupees (INR) unless otherwise stated
- All fees are non-refundable except as stated in our refund policy

**Refund Policy:**
- 7-day money-back guarantee for new subscriptions
- Pro-rated refunds are not available for early cancellation
- Refund requests must be submitted via email

**Billing:**
- We use secure third-party payment processors
- You authorize us to charge your payment method automatically
- Failed payments may result in service suspension`
    },
    {
        title: '7. Privacy',
        content: `Your use of ayoAI is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using the Service, you consent to the data practices described in our Privacy Policy.`
    },
    {
        title: '8. Disclaimers',
        content: `**AI Limitations:**
- AI responses may not always be accurate, complete, or current
- ayoAI should not be used as a substitute for professional advice
- We do not guarantee any specific outcome from using the Service

**Service Availability:**
- We strive for 99.9% uptime but do not guarantee uninterrupted access
- Scheduled maintenance may temporarily affect availability
- We are not liable for any downtime or service interruptions

**Third-Party Content:**
- The Service may contain links to third-party websites
- We are not responsible for third-party content or practices`
    },
    {
        title: '9. Limitation of Liability',
        content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:

- ayoAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages
- Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim
- We are not liable for any loss of data, profits, or business opportunities+

This limitation applies regardless of the legal theory on which the claim is based.`
    },
    {
        title: '10. Indemnification',
        content: `You agree to indemnify, defend, and hold harmless ayoAI and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from:

- Your use of the Service
- Your violation of these Terms
- Your violation of any third-party rights
- Content you submit or create using the Service`
    },
    {
        title: '11. Termination',
        content: `**By You:**
- You may terminate your account at any time from your account settings
- Termination does not entitle you to any refund of prepaid fees

**By Us:**
- We may suspend or terminate your account for violation of these Terms
- We may terminate the Service entirely with 30 days notice
- Upon termination, your right to use the Service ceases immediately

**Effect of Termination:**
- We may delete your data in accordance with our data retention policy
- Provisions that should survive termination will remain in effect`
    },
    {
        title: '12. Changes to Terms',
        content: `We reserve the right to modify these Terms at any time. We will notify you of material changes by:

- Posting the updated Terms on this page
- Sending an email to your registered address
- Displaying a notice within the Service

Your continued use of ayoAI after changes constitutes acceptance of the modified Terms. If you do not agree to the new Terms, you must stop using the Service.`
    },
    {
        title: '13. Governing Law',
        content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.`
    },
    {
        title: '14. Contact Information',
        content: `For questions about these Terms of Service, please contact us:

**Email:** legal@ayoai.com
**Address:** ayoAI Technologies Pvt. Ltd., Bangalore, Karnataka, India`
    },
];

export default function TermsPage() {
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
                        <FileText className="w-4 h-4 mr-2" />
                        Legal
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Terms of Service
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
                                Welcome to ayoAI. These Terms of Service govern your use of our AI-powered assistant platform. Please read these terms carefully before using our services. By accessing or using ayoAI, you agree to be bound by these terms and our Privacy Policy.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Terms Sections */}
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
                                            if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                                                const [title, ...rest] = paragraph.split(':**');
                                                return (
                                                    <p key={i} className="mt-4 mb-2">
                                                        <span className="font-semibold text-foreground">{title.replace(/\*\*/g, '')}:</span>
                                                        {rest.join(':**')}
                                                    </p>
                                                );
                                            }
                                            if (paragraph.startsWith('- ')) {
                                                return (
                                                    <li key={i} className="ml-4 mb-1">
                                                        {paragraph.substring(2)}
                                                    </li>
                                                );
                                            }
                                            return paragraph ? <p key={i} className="mb-2">{paragraph}</p> : null;
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
                        By using ayoAI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
