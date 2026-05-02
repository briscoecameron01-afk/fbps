import { supabase } from './supabase';

export async function signUp({
  email,
  password,
  username,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();
  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();
  const fullName = `${normalizedFirstName} ${normalizedLastName}`.trim();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        username: normalizedUsername,
        full_name: fullName,
      },
    },
  });

  if (!error && data?.user && data?.session) {
    await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        username: normalizedUsername,
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        full_name: fullName,
        email: normalizedEmail,
      });
  }

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    needsEmailConfirmation: !!data?.user && !data?.session,
    error: error?.message ?? null,
  };
}

export async function signIn({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
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
