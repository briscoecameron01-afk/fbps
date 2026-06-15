import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const mockSession = { data: { session: null }, error: null };

const mockSupabase = {
  auth: {
    getSession: async () => mockSession,
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
    signInWithOAuth: async (..._args: any[]) => ({ data: null, error: null }),
    signUp: async (..._args: any[]) => ({ data: { user: null }, error: null }),
    signInWithPassword: async (..._args: any[]) => ({ data: { user: null }, error: null }),
    signOut: async (..._args: any[]) => ({ error: null }),
    resetPasswordForEmail: async (..._args: any[]) => ({ data: null, error: null }),
    updateUser: async (..._args: any[]) => ({ data: { user: null }, error: null }),
    verifyOtp: async (..._args: any[]) => ({ data: { user: null }, error: null }),
    resend: async (..._args: any[]) => ({ data: null, error: null }),
  },
  functions: {
    invoke: async () => ({
      data: null,
      error: {
        message: 'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
      },
    }),
  },
};

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : mockSupabase;
