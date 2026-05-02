const plaidBaseUrls: Record<string, string> = {
  sandbox: 'https://sandbox.plaid.com',
  development: 'https://development.plaid.com',
  production: 'https://production.plaid.com',
};

export function getPlaidBaseUrl() {
  const env = Deno.env.get('PLAID_ENV') || 'sandbox';
  return plaidBaseUrls[env] || plaidBaseUrls.sandbox;
}

export async function plaidRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const clientId = Deno.env.get('PLAID_CLIENT_ID');
  const secret = Deno.env.get('PLAID_SECRET');

  if (!clientId || !secret) {
    throw new Error('Missing PLAID_CLIENT_ID or PLAID_SECRET');
  }

  const response = await fetch(`${getPlaidBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      secret,
      ...body,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_message || data.display_message || 'Plaid request failed');
  }

  return data as T;
}
