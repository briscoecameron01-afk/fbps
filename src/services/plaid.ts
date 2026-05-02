import { Platform } from 'react-native';
import { supabase } from './supabase';

export type LinkedAccount = {
  id: string;
  institution_name: string;
  account_name: string;
  account_mask: string;
  account_type: string | null;
  account_subtype: string | null;
  is_primary: boolean;
  is_active: boolean;
};

export type PlaidInstitution = {
  name?: string;
  institution_id?: string;
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

const mockAccounts: LinkedAccount[] = [
  {
    id: 'mock-1',
    institution_name: 'Chase Bank',
    account_name: 'Total Checking',
    account_mask: '4832',
    account_type: 'depository',
    account_subtype: 'checking',
    is_primary: true,
    is_active: true,
  },
  {
    id: 'mock-2',
    institution_name: 'Bank of America',
    account_name: 'Savings',
    account_mask: '9271',
    account_type: 'depository',
    account_subtype: 'savings',
    is_primary: false,
    is_active: true,
  },
];

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
  return invokePlaidFunction('plaid-exchange-public-token', {
    public_token: publicToken,
    institution: metadata?.institution,
  });
}

export async function getLinkedAccounts() {
  const { data, error } = await supabase
    .from('linked_accounts')
    .select('id,institution_name,account_name,account_mask,account_type,account_subtype,is_primary,is_active')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return mockAccounts;
  return (data || []) as LinkedAccount[];
}

export async function unlinkAccount(id: string) {
  const { error } = await supabase
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
      supabase
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
