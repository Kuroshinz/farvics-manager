import { NextResponse } from 'next/server';
import { createClient } from '../../../../shared/infrastructure/supabase/server';
import dns from 'dns/promises';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.NODE_ENV === 'production' && process.env.DEBUG_AUTH !== 'true') {
    return NextResponse.json({ error: 'Endpoint disabled in production.' }, { status: 403 });
  }

  const results: any = {
    environment: {},
    dns: {},
    connectivity: {},
    clientInit: {},
    fetchWrap: {}
  };

  try {
    const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const parsedUrl = supaUrl ? new URL(supaUrl) : null;
    
    results.environment = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      runtime: process.env.NEXT_RUNTIME || 'Node.js',
      vercelRegion: process.env.VERCEL_REGION || 'local',
      supabaseUrlMasked: parsedUrl ? `${parsedUrl.protocol}//***.${parsedUrl.hostname.split('.').slice(-2).join('.')}` : 'missing',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'missing',
      hostname: parsedUrl?.hostname || 'missing',
      origin: parsedUrl?.origin || 'missing',
      protocol: parsedUrl?.protocol || 'missing',
      anonKeyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };

    if (parsedUrl) {
      try {
        const lookup = await dns.lookup(parsedUrl.hostname);
        results.dns = { address: lookup.address, family: lookup.family };
      } catch (e: any) {
        results.dns = { error: e.message, code: e.code };
      }
    }

    const testFetch = async (endpoint: string, headers: any = {}) => {
      const start = Date.now();
      try {
        const res = await fetch(`${supaUrl}${endpoint}`, { headers, cache: 'no-store' });
        const text = await res.text();
        
        // Strip sensitive headers
        const safeHeaders: Record<string, string> = {};
        res.headers.forEach((val, key) => {
          if (!key.toLowerCase().includes('auth') && !key.toLowerCase().includes('key')) {
            safeHeaders[key] = val;
          }
        });

        return {
          status: res.status,
          headers: safeHeaders,
          bodyTrimmed: text.substring(0, 150),
          elapsedMs: Date.now() - start
        };
      } catch (e: any) {
        return {
          error: e.message,
          name: e.name,
          code: e.cause?.code || e.code,
          syscall: e.cause?.syscall,
          elapsedMs: Date.now() - start
        };
      }
    };

    results.connectivity.authSettings = await testFetch('/auth/v1/settings');
    results.connectivity.restV1 = await testFetch('/rest/v1/', { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' });

    const supabase = createClient();
    results.clientInit = {
      clientPackage: '@supabase/ssr',
      cookiesAdapter: 'next/headers',
      resolvedUrl: (supabase as any).supabaseUrl ? 'exists' : 'missing',
      customFetch: typeof (supabase as any).fetch === 'function' ? 'yes' : 'no'
    };

    try {
      await fetch('https://invalid.local.supabase.co');
    } catch (e: any) {
      results.fetchWrap = {
         message: e.message,
         name: e.name,
         code: e.cause?.code || e.code,
         syscall: e.cause?.syscall,
         errno: e.cause?.errno
      };
    }

  } catch (e: any) {
    results.fatal = { message: e.message, stack: e.stack };
  }

  return NextResponse.json(results);
}
