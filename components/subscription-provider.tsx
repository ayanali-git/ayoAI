'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

interface UsageLimits {
    dailyMessages: number;
    dailyImageGenerations: number;
    maxFileSize: number;
    canUploadFiles: boolean;
}

interface UsageStats {
    messages: {
        used: number;
        limit: number;
        remaining: number;
    };
    images: {
        used: number;
        limit: number;
        remaining: number;
    };
}

interface SubscriptionContextType {
    plan: string;
    status: string;
    hasActiveSubscription: boolean;
    limits: UsageLimits;
    usage: UsageStats;
    loading: boolean;
    refreshSubscription: () => Promise<void>;
    canUseFeature: (feature: 'messages' | 'images' | 'files') => boolean;
    getRemainingUsage: (feature: 'messages' | 'images') => number;
}

const defaultLimits: UsageLimits = {
    dailyMessages: 10,
    dailyImageGenerations: 5,
    maxFileSize: 10 * 1024 * 1024,
    canUploadFiles: true,
};

const defaultUsage: UsageStats = {
    messages: { used: 0, limit: 10, remaining: 10 },
    images: { used: 0, limit: 5, remaining: 5 },
};

const SubscriptionContext = createContext<SubscriptionContextType>({
    plan: 'free',
    status: 'inactive',
    hasActiveSubscription: false,
    limits: defaultLimits,
    usage: defaultUsage,
    loading: true,
    refreshSubscription: async () => { },
    canUseFeature: () => true,
    getRemainingUsage: () => 0,
});

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [plan, setPlan] = useState('free');
    const [status, setStatus] = useState('inactive');
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [limits, setLimits] = useState<UsageLimits>(defaultLimits);
    const [usage, setUsage] = useState<UsageStats>(defaultUsage);
    const [loading, setLoading] = useState(true);

    const fetchSubscription = useCallback(async () => {
        if (!user) {
            setPlan('free');
            setStatus('inactive');
            setHasActiveSubscription(false);
            setLimits(defaultLimits);
            setUsage(defaultUsage);
            setLoading(false);
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                setLoading(false);
                return;
            }

            const response = await fetch('/api/subscription', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPlan(data.plan || 'free');
                setStatus(data.status || 'inactive');
                setHasActiveSubscription(data.hasActiveSubscription || false);
                setLimits(data.limits || defaultLimits);
                setUsage(data.usage || defaultUsage);
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    const canUseFeature = useCallback((feature: 'messages' | 'images' | 'files'): boolean => {
        if (feature === 'files') {
            return limits.canUploadFiles;
        }
        if (feature === 'messages') {
            return limits.dailyMessages === -1 || usage.messages.remaining > 0;
        }
        if (feature === 'images') {
            return limits.dailyImageGenerations === -1 || usage.images.remaining > 0;
        }
        return true;
    }, [limits, usage]);

    const getRemainingUsage = useCallback((feature: 'messages' | 'images'): number => {
        if (feature === 'messages') {
            return limits.dailyMessages === -1 ? -1 : usage.messages.remaining;
        }
        return limits.dailyImageGenerations === -1 ? -1 : usage.images.remaining;
    }, [limits, usage]);

    const value = {
        plan,
        status,
        hasActiveSubscription,
        limits,
        usage,
        loading,
        refreshSubscription: fetchSubscription,
        canUseFeature,
        getRemainingUsage,
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export { SubscriptionContext };
