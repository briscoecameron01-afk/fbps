export class UnitApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'UnitApiError';
    this.status = status;
    this.data = data;
  }
}

const unitBaseUrls: Record<string, string> = {
  sandbox: 'https://api.s.unit.sh',
  production: 'https://api.unit.co',
  live: 'https://api.unit.co',
};

export function getUnitBaseUrl() {
  const explicitUrl = Deno.env.get('UNIT_API_BASE_URL') || Deno.env.get('UNIT_BASE_URL');
  if (explicitUrl) return explicitUrl.replace(/\/$/, '');

  const env = (Deno.env.get('UNIT_ENV') || 'sandbox').toLowerCase();
  return unitBaseUrls[env] || unitBaseUrls.sandbox;
}

function getUnitApiToken() {
  const token = Deno.env.get('UNIT_API_TOKEN');
  if (!token) throw new Error('Missing UNIT_API_TOKEN');
  return token;
}

function getUnitErrorMessage(data: any) {
  const firstError = data?.errors?.[0];
  return (
    firstError?.detail ||
    firstError?.details ||
    firstError?.title ||
    data?.message ||
    'Unit request failed'
  );
}

export async function unitRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${getUnitBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${getUnitApiToken()}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new UnitApiError(getUnitErrorMessage(data), response.status, data);
  }

  return data as T;
}

export function getDefaultUnitCustomerId() {
  return Deno.env.get('UNIT_CUSTOMER_ID') || Deno.env.get('UNIT_DEFAULT_CUSTOMER_ID') || '';
}

export function getDefaultUnitDepositAccountId() {
  return Deno.env.get('UNIT_DEPOSIT_ACCOUNT_ID') || Deno.env.get('UNIT_DEFAULT_DEPOSIT_ACCOUNT_ID') || '';
}
