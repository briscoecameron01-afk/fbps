import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export function createSupabaseClients(req: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const authorization = req.headers.get('Authorization') || '';
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  return { userClient, adminClient };
}

export async function requireUser(req: Request) {
  const { userClient, adminClient } = createSupabaseClients(req);
  const { data, error } = await userClient.auth.getUser();

  if (error || !data.user) {
    throw new Error('Not authenticated');
  }

  return { user: data.user, adminClient };
}
