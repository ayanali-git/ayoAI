'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Code, Key, Zap, Send, Image, FileText, MessageCircle, ChevronRight, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const endpoints = [
    {
        method: 'POST',
        path: '/v1/chat/completions',
        description: 'Send a message and get an AI response',
        example: `curl -X POST https://api.ayoai.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello, how are you?", "model": "ayo-1"}'`
    },
    {
        method: 'POST',
        path: '/v1/images/generate',
        description: 'Generate an image from a text prompt',
        example: `curl -X POST https://api.ayoai.com/v1/images/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "A sunset over mountains", "size": "1024x1024"}'`
    },
    {
        method: 'POST',
        path: '/v1/documents/analyze',
        description: 'Analyze an uploaded document',
        example: `curl -X POST https://api.ayoai.com/v1/documents/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@document.pdf" \\
  -F "query=Summarize this document"`
    },
];

const sdks = [
    { name: 'Python', version: '1.2.0', command: 'pip install ayoai' },
    { name: 'JavaScript', version: '1.1.5', command: 'npm install @ayoai/sdk' },
    { name: 'Go', version: '0.8.0', command: 'go get github.com/ayoai/go-sdk' },
];

const quickStart = `import { AyoAI } from '@ayoai/sdk';

const client = new AyoAI({ apiKey: 'YOUR_API_KEY' });

const response = await client.chat.complete({
  message: 'Hello, what can you help me with?',
  model: 'ayo-1'
});

console.log(response.content);`;

export default function ApiDocsPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mb-4 px-4 py-1">
                        <Code className="w-4 h-4 mr-2" />API Reference
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">ayoAI API</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Integrate powerful AI capabilities into your applications with our REST API.
                    </p>
                </motion.div>

                {/* Quick Start */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Quick Start</h2>
                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg text-foreground">JavaScript / TypeScript</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => copyCode(quickStart, 'quickstart')} className="text-muted-foreground hover:text-foreground">
                                {copied === 'quickstart' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm text-muted-foreground"><code>{quickStart}</code></pre>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Authentication */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Authentication</h2>
                    <Card className="bg-card border-border">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                    <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-foreground font-medium mb-2">API Key Authentication</h3>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        All API requests require authentication via Bearer token. Include your API key in the Authorization header.
                                    </p>
                                    <code className="bg-muted px-3 py-2 rounded text-sm text-purple-600 dark:text-purple-400">
                                        Authorization: Bearer YOUR_API_KEY
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Endpoints */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Endpoints</h2>
                    <div className="space-y-6">
                        {endpoints.map((endpoint, i) => (
                            <Card key={i} className="bg-card border-border">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">{endpoint.method}</Badge>
                                        <code className="text-foreground font-mono">{endpoint.path}</code>
                                    </div>
                                    <p className="text-muted-foreground text-sm mt-2">{endpoint.description}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">Example Request</span>
                                        <Button variant="ghost" size="sm" onClick={() => copyCode(endpoint.example, `endpoint-${i}`)} className="text-muted-foreground hover:text-foreground">
                                            {copied === `endpoint-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs text-muted-foreground"><code>{endpoint.example}</code></pre>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* SDKs */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">SDKs & Libraries</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {sdks.map((sdk, i) => (
                            <Card key={i} className="bg-card border-border">
                                <CardContent className="p-6">
                                    <h3 className="text-foreground font-medium mb-1">{sdk.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">v{sdk.version}</p>
                                    <code className="block bg-muted px-3 py-2 rounded text-xs text-purple-600 dark:text-purple-400">{sdk.command}</code>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Card className="bg-gradient-to-br from-card to-muted border-purple-500/20">
                        <CardContent className="py-8 text-center">
                            <h3 className="text-xl font-bold text-foreground mb-2">Ready to Build?</h3>
                            <p className="text-muted-foreground mb-4">Get your API key and start integrating ayoAI today.</p>
                            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                <Link href="/settings">Get API Key<ChevronRight className="w-4 h-4 ml-1" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
