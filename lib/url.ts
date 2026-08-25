/**
 * Resolves the canonical application base URL reliably across both client and server,
 * handling local development, Vercel deployments, custom domains, and reverse proxies.
 */
export function getAppUrl(request?: Request): string {
  // 1. In browser environment: always use the active window origin
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }

  // 2. From Server Request headers (NextRequest / Request)
  if (request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, '');
    }

    const host = request.headers.get('host');
    if (host && !host.includes('localhost:3000')) {
      const proto = host.includes('localhost') ? 'http' : 'https';
      return `${proto}://${host}`.replace(/\/$/, '');
    }

    try {
      const url = new URL(request.url);
      if (url.origin && !url.origin.includes('localhost:3000')) {
        return url.origin.replace(/\/$/, '');
      }
    } catch {
      // fallback
    }
  }

  // 3. From environment variables (production domain > app url > vercel url)
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (envUrl) {
    let cleanUrl = envUrl.trim().replace(/\/$/, '');
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    return cleanUrl;
  }

  // 4. Default fallback for local development
  return 'http://localhost:3000';
}

/**
 * Returns the full auth callback redirect URL
 */
export function getAuthCallbackUrl(nextPath = '/c', request?: Request): string {
  const base = getAppUrl(request);
  const cleanNext = nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
  return `${base}/auth/callback?next=${encodeURIComponent(cleanNext)}`;
}
