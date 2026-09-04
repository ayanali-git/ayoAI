import type { CookieOptions } from '@supabase/ssr';

export const AUTH_COOKIE_NAME = 'closeai-access';

/** Persistent cookies max age: ~30 days (maximum browser supported). */
export const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

export const authCookieOptions: CookieOptions & { name: string } = {
  name: AUTH_COOKIE_NAME,
  path: '/',
  sameSite: 'lax',
  maxAge: AUTH_COOKIE_MAX_AGE,
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
};

