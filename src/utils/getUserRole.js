import { supabase } from '../lib/supabaseClient';

export async function getUserRole() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { role: null, error: userError || new Error('No user found') };
  }

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    return { role: null, error };
  }

  return { role: data?.role, error: null };
}
