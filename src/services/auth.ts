import { supabase } from './supabase';

export async function signUp({ email, password }: { email: string; password: string; username?: string }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user ?? null, error: error?.message ?? null };
}

export async function signIn({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user ?? null, error: error?.message ?? null };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function resetPassword({ email }: { email: string }) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error: error?.message ?? null };
}

export async function sendOTP({ email }: { email: string }) {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  return { error: error?.message ?? null };
}

export async function verifyOTP({ email, token }: { email: string; token: string }) {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
  return { user: data?.user ?? null, error: error?.message ?? null };
}
