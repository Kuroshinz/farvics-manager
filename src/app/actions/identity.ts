'use server';

import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';

export async function authenticate() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { authenticated: false };
  }

  return { 
    authenticated: true, 
    user: {
      id: user.id,
      email: user.email,
    } 
  };
}
