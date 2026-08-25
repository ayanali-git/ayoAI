import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient, User } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { authCookieOptions } from '@/lib/auth-cookie';

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: authCookieOptions,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            );
          } catch (error) {
            // This can happen when called from a Server Component
          }
        },
      },
    }
  );
}

// Admin client for backend operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Universal server-side auth getter:
 * Checks Authorization header first, then falls back to request cookies / cookieStore.
 */
export async function getServerAuthUser(request?: NextRequest): Promise<{ user: User | null; error: any }> {
  try {
    // 1. Check Bearer token in Authorization header
    if (request) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token && token !== 'undefined' && token !== 'null') {
          const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
          if (user && !error) {
            return { user, error: null };
          }
        }
      }
    }

    // 2. Fall back to SSR cookies
    const supabase = createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user: user ?? null, error: error ?? null };
  } catch (err: any) {
    return { user: null, error: err };
  }
}


