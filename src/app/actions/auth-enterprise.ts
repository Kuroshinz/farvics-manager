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

export async function register(formData: FormData): Promise<ProblemDetails | void> {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl}/auth/callback`
    }
  });
  
  if (error) return createProblem('Registration Failed', error.message);
  redirect('/login?message=Vui lòng kiểm tra email của bạn để xác thực tài khoản.');
}
