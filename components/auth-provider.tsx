'use client';

import React, { createContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  token: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  token: null,
  loading: true,
  signOut: async () => { },
  refreshSession: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const profileCheckedRef = useRef<string | null>(null);

  const ensureProfile = useCallback(async (currentUser: User) => {
    if (!currentUser?.id || profileCheckedRef.current === currentUser.id) return;
    profileCheckedRef.current = currentUser.id;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!profile && currentUser.email) {
        const name = currentUser.user_metadata?.full_name || 
                     currentUser.user_metadata?.name || 
                     currentUser.user_metadata?.user_name ||
                     currentUser.email?.split('@')[0] || '';
        const avatarUrl = currentUser.user_metadata?.avatar_url || 
                          currentUser.user_metadata?.picture || null;

        await supabase.from('profiles').upsert({
          id: currentUser.id,
          email: currentUser.email,
          name: name,
          avatar_url: avatarUrl,
          plan: 'free',
          subscription_status: 'inactive',
        }, { onConflict: 'id' });
      }
    } catch (error) {
      console.error('Error ensuring profile in AuthProvider:', error);
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<Session | null> => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (!error && currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        return currentSession;
      }
      return null;
    } catch (err) {
      console.error('Error refreshing session:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Fast initial check to populate session immediately on mount
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (initialSession && !error) {
        setSession(initialSession);
        setUser(initialSession.user);
        ensureProfile(initialSession.user);
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    // Authoritative listener for auth state changes & token refreshes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        const currentUser = newSession?.user ?? null;
        setSession(newSession);
        setUser(currentUser);
        setLoading(false);

        if (currentUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION')) {
          ensureProfile(currentUser);
        }

        if (event === 'SIGNED_OUT') {
          profileCheckedRef.current = null;
          setUser(null);
          setSession(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [ensureProfile]);

  const signOut = async () => {
    try {
      profileCheckedRef.current = null;
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
    setSession(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    } else {
      router.push('/');
    }
  };

  const value = {
    user,
    session,
    token: session?.access_token ?? null,
    loading,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}