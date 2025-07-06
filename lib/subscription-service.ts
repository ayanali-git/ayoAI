import { supabase } from './supabase';

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: string;
  planName: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface UsageLimits {
  dailyMessages: number;
  dailyImageGenerations: number;
  maxFileSize: number;
  canUploadFiles: boolean;
}

class SubscriptionService {
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw new Error(`Failed to get subscription: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        stripeSubscriptionId: data.stripe_subscription_id,
        stripeCustomerId: data.stripe_customer_id,
        status: data.status,
        planName: data.plan_name,
        currentPeriodStart: data.current_period_start,
        currentPeriodEnd: data.current_period_end,
        cancelAtPeriodEnd: data.cancel_at_period_end,
      };
    } catch (error) {
      console.error('Get user subscription error:', error);
      throw error;
    }
  }

  async getUserPlan(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get user plan error:', error);
        return 'free';
      }

      return data.plan || 'free';
    } catch (error) {
      console.error('Get user plan error:', error);
      return 'free';
    }
  }

  getUsageLimits(plan: string): UsageLimits {
    switch (plan) {
      case 'pro':
        return {
          dailyMessages: -1, // Unlimited
          dailyImageGenerations: 100,
          maxFileSize: 50 * 1024 * 1024, // 50MB
          canUploadFiles: true,
        };
      case 'ultra':
        return {
          dailyMessages: -1, // Unlimited
          dailyImageGenerations: -1, // Unlimited
          maxFileSize: 100 * 1024 * 1024, // 100MB
          canUploadFiles: true,
        };
      case 'free':
      default:
        return {
          dailyMessages: 10,
          dailyImageGenerations: 5,
          maxFileSize: 10 * 1024 * 1024, // 10MB
          canUploadFiles: true,
        };
    }
  }

  async checkUsageLimit(userId: string, type: 'messages' | 'images'): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    try {
      const plan = await this.getUserPlan(userId);
      const limits = this.getUsageLimits(plan);
      
      const dailyLimit = type === 'messages' ? limits.dailyMessages : limits.dailyImageGenerations;
      
      if (dailyLimit === -1) {
        return { allowed: true, remaining: -1, limit: -1 };
      }

      // Get today's usage count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let usageCount = 0;
      
      if (type === 'messages') {
        // First, get all chat IDs for the user
        const { data: chats, error: chatsError } = await supabase
          .from('chats')
          .select('id')
          .eq('user_id', userId);

        if (chatsError) {
          throw new Error(`Failed to get chats: ${chatsError.message}`);
        }

        const chatIds = chats?.map((chat: { id: string }) => chat.id) || [];

        // Now, count messages for those chat IDs
        const { data, error } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('role', 'user')
          .gte('created_at', today.toISOString())
          .in('chat_id', chatIds);

        if (!error && data) {
          usageCount = data.length;
        }
      } else {
        // Count image generation requests (would be tracked separately in a real app)
        usageCount = 0; // Placeholder
      }

      const remaining = Math.max(0, dailyLimit - usageCount);
      const allowed = remaining > 0;

      return { allowed, remaining, limit: dailyLimit };
    } catch (error) {
      console.error('Check usage limit error:', error);
      // Allow on error to prevent blocking users
      return { allowed: true, remaining: 0, limit: 0 };
    }
  }

  async updateUserPlan(userId: string, plan: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan })
        .eq('id', userId);

      if (error) {
        throw new Error(`Failed to update user plan: ${error.message}`);
      }
    } catch (error) {
      console.error('Update user plan error:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();