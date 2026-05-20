import { supabase } from './supabase';

export type ReadyToLaunchTokenResponse = {
  token: string;
  environment: 'sandbox' | 'production' | 'live' | string;
};

export async function createReadyToLaunchToken() {
  const { data, error } = await supabase.functions.invoke('unit-create-ready-to-launch-token');
  if (error || data?.error) {
    throw new Error(error?.message || data?.error || 'Unable to create Unit Ready-to-Launch token');
  }

  return data as ReadyToLaunchTokenResponse;
}

export function clearReadyToLaunchSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('unitCustomerToken');
  window.localStorage.removeItem('unitVerifiedCustomerToken');
}
