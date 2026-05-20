import { Platform } from 'react-native';
import { supabase } from './supabase';

export type LinkedAccount = {
  id: string;
  institution_name: string;
  account_name: string;
  account_mask: string;
  account_type: string | null;
  account_subtype: string | null;
  balance_available: number | null;
  balance_current: number | null;
  balance_iso_currency_code: string | null;
  balance_last_synced_at: string | null;
  is_primary: boolean;
  is_active: boolean;
  unit_counterparty_id?: string | null;
  unit_counterparty_status?: string | null;
};

export type PlaidInstitution = {
  name?: string;
  institution_id?: string;
};

export type ExchangePublicTokenResponse = {
  success: boolean;
  accounts: LinkedAccount[];
};

declare global {
  interface Window {
    Plaid?: {
      create: (config: {
        token: string;
        onSuccess: (publicToken: string, metadata: any) => void;
        onExit?: (error: any, metadata: any) => void;
      }) => { open: () => void; exit: () => void };
    };
  }
}

function assertNoFunctionError(error: any) {
  if (error) {
    throw new Error(error.message || 'Plaid request failed');
  }
}

async function invokePlaidFunction<T>(name: string, body?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  assertNoFunctionError(error);
  if (!data) throw new Error('Plaid function returned no data');
  return data as T;
}

export async function createLinkToken() {
  const data = await invokePlaidFunction<{ link_token: string }>('plaid-create-link-token');
  return data.link_token;
}

export async function exchangePublicToken(publicToken: string, metadata?: { institution?: PlaidInstitution }) {
  return invokePlaidFunction<ExchangePublicTokenResponse>('plaid-exchange-public-token', {
    public_token: publicToken,
    institution: metadata?.institution,
  });
}

export async function getLinkedAccounts() {
  const { data, error } = await (supabase as any)
    .from('linked_accounts')
    .select('id,institution_name,account_name,account_mask,account_type,account_subtype,balance_available,balance_current,balance_iso_currency_code,balance_last_synced_at,is_primary,is_active,unit_counterparty_id,unit_counterparty_status')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message || 'Unable to load linked accounts');
  return (data || []) as LinkedAccount[];
}

export async function refreshLinkedAccountBalances() {
  const { data, error } = await supabase.functions.invoke('plaid-refresh-balances');
  if (error) throw new Error(error.message || 'Failed to refresh balances');
  return data;
}

export async function unlinkAccount(id: string) {
  const { error } = await (supabase as any)
    .from('linked_accounts')
    .update({ is_active: false })
    .eq('id', id);

  assertNoFunctionError(error);
  return { success: true };
}

export async function setPrimaryAccount(id: string) {
  const accounts = await getLinkedAccounts();
  await Promise.all(
    accounts.map((account) =>
      (supabase as any)
        .from('linked_accounts')
        .update({ is_primary: account.id === id })
        .eq('id', account.id)
    )
  );

  return { success: true };
}

function loadPlaidWebScript() {
  return new Promise<void>((resolve, reject) => {
    if (Platform.OS !== 'web') {
      reject(new Error('Plaid web Link can only run on web'));
      return;
    }

    if (window.Plaid) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Plaid Link')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Plaid Link'));
    document.body.appendChild(script);
  });
}

export async function openPlaidLinkWeb(token: string) {
  await loadPlaidWebScript();

  return new Promise<{ publicToken: string; metadata: any }>((resolve, reject) => {
    const handler = window.Plaid?.create({
      token,
      onSuccess: (publicToken, metadata) => resolve({ publicToken, metadata }),
      onExit: (error) => {
        if (error) reject(new Error(error.display_message || error.error_message || 'Plaid Link exited'));
        else reject(new Error('Plaid Link was cancelled'));
      },
    });

    if (!handler) {
      reject(new Error('Plaid Link is not available'));
      return;
    }

    handler.open();
  });
}
