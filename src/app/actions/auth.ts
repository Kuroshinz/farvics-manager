'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  try {
    const supabase = createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return {
        type: 'about:blank',
        title: 'Đăng nhập thất bại',
        status: 401,
        detail: error.message
      };
    }
    return { ok: true, redirectUrl: '/' };
  } catch (err: any) {
    return { type: 'about:blank', title: 'Server Error', status: 500, detail: err.message || 'Unknown error' };
  }
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
