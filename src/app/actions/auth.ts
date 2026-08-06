
'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: formData.get('email') as string, password: formData.get('password') as string });
  if (error) { throw new Error(error.message); }
  redirect('/');
}
export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
