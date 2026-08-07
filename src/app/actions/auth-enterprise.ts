'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { redirect } from 'next/navigation';

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  [key: string]: any;
}

function createProblem(title: string, detail: string, status: number = 400): ProblemDetails {
  return {
    type: 'about:blank',
    title,
    status,
    detail,
  };
}

export async function forgotPassword(formData: FormData): Promise<ProblemDetails | void> {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return createProblem('Reset Password Failed', error.message);
  redirect('/auth/verify-email');
}


export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
  
  const updates = {
    full_name: formData.get('displayName'),
    timezone: formData.get('timezone'),
    language: formData.get('language'),
    avatar_url: formData.get('avatarUrl')
  };

  const { error } = await supabase.auth.updateUser({ data: updates });
  if (error) throw new Error(error.message);
  
  // Upsert preferences
  await supabase.from('user_preferences').upsert({
    user_id: session.user.id,
    timezone: updates.timezone,
    language: updates.language
  });
}


export async function logoutAllDevices(): Promise<ProblemDetails | void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return createProblem('Logout Failed', error.message, 500);
  redirect('/login');
}

export async function register(formData: FormData): Promise<ProblemDetails | { ok: true, redirectUrl: string }> {
  console.log('================= ROOT CAUSE INVESTIGATION =================');
  
  // Step 3: Verify environment values
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  console.log('[ENV] NEXT_PUBLIC_SUPABASE_URL:', supaUrl);
  console.log('[ENV] NEXT_PUBLIC_SITE_URL:', siteUrl);
  console.log('[ENV] NEXT_PUBLIC_SUPABASE_ANON_KEY:', anonKey ? 'exists' : 'missing');
  
  try {
    const parsed = new URL(supaUrl || '');
    console.log('[ENV] Parsed URL Hostname:', parsed.hostname);
  } catch (e) {
    console.error('[ENV] URL Parse Failed!');
  }
  
  console.log('[RUNTIME] Type:', process.env.NEXT_RUNTIME === 'edge' ? 'Edge runtime' : `Node version: ${process.version}`);

  // Step 4: Independent connectivity test
  console.log('--- INDEPENDENT CONNECTIVITY TEST ---');
  try {
    const healthRes = await fetch(`${supaUrl}/auth/v1/health`);
    console.log('[TEST] /auth/v1/health Status:', healthRes.status);
    const restRes = await fetch(`${supaUrl}/rest/v1/`, { headers: { apikey: anonKey || '' } });
    console.log('[TEST] /rest/v1/ Status:', restRes.status);
  } catch (err: any) {
    console.error('[TEST] Connectivity test FAILED:', err.message);
  }

  // Step 2: Verify actual outgoing request
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    console.log('--- SUPABASE FETCH INTERCEPTED ---');
    console.log('METHOD:', options?.method || 'GET');
    console.log('URL:', url);
    
    // Safely print headers
    const safeHeaders: Record<string, string> = {};
    if (options?.headers) {
      const h = options.headers as any;
      if (typeof h.forEach === 'function') {
        h.forEach((val: string, key: string) => {
          if (!key.toLowerCase().includes('auth') && !key.toLowerCase().includes('key')) safeHeaders[key] = val;
        });
      } else {
        Object.entries(h).forEach(([key, val]) => {
          if (!key.toLowerCase().includes('auth') && !key.toLowerCase().includes('key')) safeHeaders[key] = val as string;
        });
      }
    }
    console.log('HEADERS (without secrets):', safeHeaders);
    console.log('BODY SIZE:', options?.body ? (options.body as string).length : 0);

    try {
      return await originalFetch(url, options);
    } catch (error: any) {
      console.error('--- FETCH FATAL ERROR DUMP ---');
      console.error('Name:', error.name);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.error('Cause:', error.cause);
      console.dir(error, { depth: null });
      throw error;
    }
  };

  try {
    const supabase = createClient();
    console.log('--- CLIENT CREATED ---');
    console.log('Client URL:', (supabase as any).supabaseUrl);
    console.log('Client Key Prefix:', (supabase as any).supabaseKey?.slice(0, 20));

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('full_name') as string;
    
    console.log('--- EXECUTING SIGNUP ---');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: fullName },
        emailRedirectTo: `${siteUrl || 'http://localhost:3000'}/auth/callback`
      }
    });
    
    global.fetch = originalFetch;
    
    if (error) return createProblem('Registration Failed', error.message);
    return { ok: true, redirectUrl: '/login?message=Vui lòng kiểm tra email của bạn để xác thực tài khoản.' };
  } catch (err: any) {
    global.fetch = originalFetch;
    return createProblem('Server Error', err.message || 'Unknown error');
  }
}
