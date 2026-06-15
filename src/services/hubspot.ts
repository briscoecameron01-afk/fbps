import { supabase } from './supabase';

export type HubSpotSyncResult = {
  success: boolean;
  contact_id?: string;
};

export async function syncHubSpotContact() {
  const { data, error } = await supabase.functions.invoke('hubspot-sync-contact');
  if (error || data?.error) {
    throw new Error(error?.message || data?.error || 'Unable to sync HubSpot contact');
  }

  return data as HubSpotSyncResult;
}
