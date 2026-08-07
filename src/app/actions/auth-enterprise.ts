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
  console.log('================= DEEP AUTH AUDIT =================');
  console.log('[ENV] SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING');
  console.log('[ENV] SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING');
  console.log('[ENV] SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || 'MISSING');
  console.log('[RUNTIME] Type:', process.env.NEXT_RUNTIME === 'edge' ? 'Edge' : 'Node.js');
  
  // Intercept global fetch
  const originalFetch = global.fetch;
  global.fetch = async (...args) => {
    console.log('[FETCH_INTERCEPT] URL:', args[0]);
    console.log('[FETCH_INTERCEPT] Options:', args[1] ? { method: args[1].method, headers: args[1].headers } : 'None');
    try {
      const response = await originalFetch(...args);
      console.log('[FETCH_INTERCEPT] Response Status:', response.status);
      return response;
    } catch (error: any) {
      console.error('[FETCH_INTERCEPT] FATAL ERROR:', {
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack: error.stack
      });
      throw error;
    }
  };

  try {
    const supabase = createClient();
    console.log('[SUPABASE_CLIENT] URL:', (supabase as any).supabaseUrl);
    console.log('[SUPABASE_CLIENT] KEY Prefix:', (supabase as any).supabaseKey?.slice(0, 20));

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('full_name') as string;
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    console.log('[SUPABASE_EXEC] Calling signUp...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: fullName },
        emailRedirectTo: `${siteUrl}/auth/callback`
      }
    });
    
    // Restore fetch
    global.fetch = originalFetch;
    
    console.log('[SUPABASE_RESULT] Error Object:', error);
    if (error) {
       console.error('[SUPABASE_RESULT] Full Error Dump:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
       return createProblem('Registration Failed', error.message);
    }
    
    return { ok: true, redirectUrl: '/login?message=Vui lòng kiểm tra email của bạn để xác thực tài khoản.' };
  } catch (err: any) {
    global.fetch = originalFetch;
    console.error('[CRITICAL_EXCEPTION] Caught in register():', {
        name: err.name,
        message: err.message,
        cause: err.cause,
        stack: err.stack
    });
    return createProblem('Server Error', err.message || 'Unknown error');
  }
}
