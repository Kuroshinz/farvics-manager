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

export async function updateProfile(formData: FormData): Promise<ProblemDetails | void> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return createProblem('Unauthorized', 'You must be logged in', 401);
  
  const { error } = await supabase.auth.updateUser({
    data: { full_name: formData.get('displayName') }
  });
  if (error) return createProblem('Profile Update Failed', error.message);
}

export async function logoutAllDevices(): Promise<ProblemDetails | void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return createProblem('Logout Failed', error.message, 500);
  redirect('/login');
}
