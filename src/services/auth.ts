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

  try {
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

    const existingUser =
      !error &&
      data?.user &&
      Array.isArray(data.user.identities) &&
      data.user.identities.length === 0;

    if (existingUser) {
      return {
        user: null,
        session: null,
        needsEmailConfirmation: false,
        error: 'An account with this email already exists.',
        errorCode: 'user_already_exists',
        errorStatus: 400,
      };
    }

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
      errorCode: error?.code ?? null,
      errorStatus: error?.status ?? null,
    };
  } catch (error: any) {
    return {
      user: null,
      session: null,
      needsEmailConfirmation: false,
      error: error?.message || 'Unable to create your account. Please try again.',
      errorCode: error?.code ?? null,
      errorStatus: error?.status ?? null,
    };
  }
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
