'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Activity, CheckCircle, Clock, AlertTriangle, Server, Globe, MessageSquare, Image, FileText, Zap } from 'lucide-react';

const services = [
    { name: 'AI Chat Service', status: 'operational', uptime: '99.99%', icon: MessageSquare, description: 'Core conversation functionality' },
    { name: 'Image Generation', status: 'operational', uptime: '99.95%', icon: Image, description: 'AI-powered image creation' },
    { name: 'Document Analysis', status: 'operational', uptime: '99.97%', icon: FileText, description: 'File upload and analysis' },
    { name: 'Authentication', status: 'operational', uptime: '99.99%', icon: Server, description: 'Login and account management' },
    { name: 'API Services', status: 'operational', uptime: '99.98%', icon: Zap, description: 'Developer API endpoints' },
    { name: 'Website', status: 'operational', uptime: '99.99%', icon: Globe, description: 'Web application interface' },
];

const incidents = [
    { date: 'Jan 20, 2026', title: 'Scheduled Maintenance Complete', status: 'resolved', description: 'Upgraded image generation infrastructure.', time: '03:00 - 04:30 UTC' },
    { date: 'Jan 15, 2026', title: 'Minor API Latency', status: 'resolved', description: 'Increased response times resolved within 45 minutes.', time: '14:20 - 15:05 UTC' },
    { date: 'Jan 8, 2026', title: 'Image Generation Delayed', status: 'resolved', description: 'Additional capacity deployed.', time: '19:00 - 20:00 UTC' },
];

export default function StatusPage() {
    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mb-4 px-4 py-1">
                        <Activity className="w-4 h-4 mr-2" />System Status
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">ayoAI Status</h1>
                    <Card className="inline-block bg-green-500/10 border-green-500/30">
                        <CardContent className="py-4 px-8 flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400">All Systems Operational</span>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Services</h2>
                    <div className="space-y-4">
                        {services.map((service, i) => (
                            <Card key={i} className="bg-card border-border">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                                            <service.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-foreground font-medium">{service.name}</h3>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground hidden sm:block">{service.uptime}</span>
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Recent Incidents</h2>
                    <div className="space-y-4">
                        {incidents.map((incident, i) => (
                            <Card key={i} className="bg-card border-border">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <div>
                                            <h3 className="text-foreground font-medium">{incident.title}</h3>
                                            <p className="text-sm text-muted-foreground">{incident.date} • {incident.time}</p>
                                        </div>
                                        <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">Resolved</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{incident.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
