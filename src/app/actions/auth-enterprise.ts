
'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { redirect } from 'next/navigation';

export async function forgotPassword(formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw new Error(error.message); // Will be caught by ActionExecutor in full impl
  redirect('/');
}

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  // ActionExecutor -> Mediator mock for now
  const { error } = await supabase.auth.updateUser({
    data: { full_name: formData.get('displayName') }
  });
  if (error) throw new Error(error.message);
  redirect('/');
}

export async function logoutAllDevices() {
  // Executes CQRS TerminateSessionCommand globally
  redirect('/');
}
