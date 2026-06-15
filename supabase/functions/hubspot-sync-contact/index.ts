import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { requireUser } from '../_shared/supabase.ts';

type HubSpotContact = {
  id: string;
  properties?: Record<string, string | null>;
};

type HubSpotSearchResponse = {
  total: number;
  results: HubSpotContact[];
};

type ProfileRow = {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  username?: string | null;
  phone_number?: string | null;
  has_completed_onboarding?: boolean | null;
  hubspot_contact_id?: string | null;
};

function getHubSpotToken() {
  const token = Deno.env.get('HUBSPOT_PRIVATE_APP_TOKEN');
  if (!token) throw new Error('Missing HUBSPOT_PRIVATE_APP_TOKEN');
  return token;
}

function getErrorMessage(data: any) {
  return data?.message || data?.errors?.[0]?.message || 'HubSpot request failed';
}

async function hubspotRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`https://api.hubapi.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getHubSpotToken()}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as T;
}

function buildHubSpotProperties(profile: ProfileRow, email: string) {
  const properties: Record<string, string> = {
    email,
  };

  const firstName = profile.first_name?.trim();
  const lastName = profile.last_name?.trim();
  const phone = profile.phone_number?.trim();

  if (firstName) properties.firstname = firstName;
  if (lastName) properties.lastname = lastName;
  if (phone) properties.phone = phone;

  return properties;
}

async function findContactByEmail(email: string) {
  const search = await hubspotRequest<HubSpotSearchResponse>('/crm/v3/objects/contacts/search', {
    method: 'POST',
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: email,
            },
          ],
        },
      ],
      properties: ['email', 'firstname', 'lastname', 'phone'],
      limit: 1,
    }),
  });

  return search.results?.[0] || null;
}

async function upsertHubSpotContact(contactId: string | null, email: string, properties: Record<string, string>) {
  if (contactId) {
    try {
      return await hubspotRequest<HubSpotContact>(`/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        body: JSON.stringify({ properties }),
      });
    } catch {
      // If the stored id was removed in HubSpot, fall through to email lookup.
    }
  }

  const existing = await findContactByEmail(email);
  if (existing?.id) {
    return hubspotRequest<HubSpotContact>(`/crm/v3/objects/contacts/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    });
  }

  return hubspotRequest<HubSpotContact>('/crm/v3/objects/contacts', {
    method: 'POST',
    body: JSON.stringify({ properties }),
  });
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  let adminClient: any = null;
  let userId = '';

  try {
    const auth = await requireUser(req);
    adminClient = auth.adminClient;
    userId = auth.user.id;

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('email,first_name,last_name,full_name,username,phone_number,has_completed_onboarding,hubspot_contact_id')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) throw profileError;

    const row = (profile || {}) as ProfileRow;
    const email = (row.email || auth.user.email || '').trim().toLowerCase();
    if (!email) throw new Error('Cannot sync HubSpot contact without an email address');

    const contact = await upsertHubSpotContact(
      row.hubspot_contact_id || null,
      email,
      buildHubSpotProperties(row, email),
    );

    const { error: updateError } = await adminClient
      .from('profiles')
      .update({
        hubspot_contact_id: contact.id,
        hubspot_last_synced_at: new Date().toISOString(),
        hubspot_sync_error: null,
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    return jsonResponse({
      success: true,
      contact_id: contact.id,
    });
  } catch (error) {
    if (adminClient && userId) {
      await adminClient
        .from('profiles')
        .update({ hubspot_sync_error: error.message || 'HubSpot sync failed' })
        .eq('id', userId);
    }

    return jsonResponse({ error: error.message }, 400);
  }
});
