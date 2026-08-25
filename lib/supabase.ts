import { createBrowserClient } from '@supabase/ssr';
import { AUTH_COOKIE_NAME, authCookieOptions } from '@/lib/auth-cookie';

export { AUTH_COOKIE_NAME };

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookieOptions: authCookieOptions,
  }
);

