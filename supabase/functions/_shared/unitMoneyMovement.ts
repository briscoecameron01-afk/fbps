import { plaidRequest } from './plaid.ts';
import {
  getDefaultUnitCustomerId,
  getDefaultUnitDepositAccountId,
  UnitApiError,
  unitRequest,
} from './unit.ts';

export type UnitTransferDirection = 'to_unit' | 'from_unit';
export type UnitAchDirection = 'Debit' | 'Credit';

type AdminClient = any;

type LinkedAccountRow = {
  id: string;
  user_id: string;
  plaid_access_token: string;
  plaid_account_id: string;
  institution_name: string | null;
  account_name: string | null;
  account_mask: string | null;
  unit_counterparty_id: string | null;
  unit_counterparty_status: string | null;
};

type ProfileRow = {
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  username?: string | null;
  unit_customer_id?: string | null;
  unit_deposit_account_id?: string | null;
};

type UnitResource = {
  type: string;
  id: string;
  attributes?: Record<string, any>;
  relationships?: Record<string, any>;
};

type UnitResponse = {
  data: UnitResource;
};

export function unitDirectionFor(direction: UnitTransferDirection): UnitAchDirection {
  return direction === 'to_unit' ? 'Debit' : 'Credit';
}

export function appStatusForUnitStatus(status?: string | null): 'pending' | 'completed' | 'failed' {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'sent' || normalized === 'completed') return 'completed';
  if (['rejected', 'returned', 'canceled', 'cancelled', 'failed'].includes(normalized)) return 'failed';
  return 'pending';
}

export function centsToDollars(cents: number | null | undefined) {
  return typeof cents === 'number' ? cents / 100 : null;
}

export function dollarsToCents(amount: number) {
  return Math.round(amount * 100);
}

export function sanitizeAchDescription(value: unknown, fallback: string) {
  const raw = typeof value === 'string' && value.trim() ? value.trim() : fallback;
  return raw.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 10) || fallback.slice(0, 10);
}

export function makeFundingSourceLabel(account: LinkedAccountRow) {
  const institution = account.institution_name || 'Linked bank';
  const accountName = account.account_name || 'Account';
  const mask = account.account_mask ? ` **** ${account.account_mask}` : '';
  return `${institution} - ${accountName}${mask}`;
}

export async function getUnitContext(adminClient: AdminClient, userId: string) {
  const { data: profile, error } = await adminClient
    .from('profiles')
    .select('first_name,last_name,full_name,username,unit_customer_id,unit_deposit_account_id')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;

  const row = (profile || {}) as ProfileRow;
  const customerId = row.unit_customer_id || getDefaultUnitCustomerId();
  const depositAccountId = row.unit_deposit_account_id || getDefaultUnitDepositAccountId();
  const name = `${row.first_name || ''} ${row.last_name || ''}`.trim() ||
    row.full_name ||
    row.username ||
    'Account Holder';

  if (!customerId) {
    throw new Error('Missing Unit customer id. Set UNIT_CUSTOMER_ID or profiles.unit_customer_id.');
  }

  if (!depositAccountId) {
    throw new Error('Missing Unit deposit account id. Set UNIT_DEPOSIT_ACCOUNT_ID or profiles.unit_deposit_account_id.');
  }

  return { customerId, depositAccountId, counterpartyName: name };
}

export async function getLinkedAccount(adminClient: AdminClient, userId: string, linkedAccountId: string) {
  const { data, error } = await adminClient
    .from('linked_accounts')
    .select('id,user_id,plaid_access_token,plaid_account_id,institution_name,account_name,account_mask,unit_counterparty_id,unit_counterparty_status')
    .eq('id', linkedAccountId)
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Linked account not found');

  return data as LinkedAccountRow;
}

export async function createUnitProcessorToken(account: LinkedAccountRow) {
  const response = await plaidRequest<{ processor_token: string }>('/processor/token/create', {
    access_token: account.plaid_access_token,
    account_id: account.plaid_account_id,
    processor: 'unit',
  });

  return response.processor_token;
}

function getExistingCounterpartyId(error: unknown) {
  if (!(error instanceof UnitApiError) || error.status !== 409) return '';
  const existingIds = error.data?.errors?.[0]?.meta?.existingIds;
  return Array.isArray(existingIds) ? String(existingIds[0] || '') : '';
}

export async function ensureUnitCounterparty(
  adminClient: AdminClient,
  account: LinkedAccountRow,
  customerId: string,
  counterpartyName: string,
) {
  if (account.unit_counterparty_id) return account.unit_counterparty_id;

  const processorToken = await createUnitProcessorToken(account);
  const verifyName = (Deno.env.get('UNIT_VERIFY_COUNTERPARTY_NAME') || 'true').toLowerCase() !== 'false';

  const body = {
    data: {
      type: 'achCounterparty',
      attributes: {
        name: counterpartyName,
        plaidProcessorToken: processorToken,
        type: 'Person',
        permissions: 'CreditAndDebit',
        verifyName,
        idempotencyKey: `counterparty-${account.id}`,
      },
      relationships: {
        customer: {
          data: {
            type: 'customer',
            id: customerId,
          },
        },
      },
    },
  };

  let counterpartyId = '';
  let counterpartyStatus = 'active';

  try {
    const response = await unitRequest<UnitResponse>('/counterparties', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    counterpartyId = response.data.id;
  } catch (error) {
    const existingId = getExistingCounterpartyId(error);
    if (!existingId) throw error;
    counterpartyId = existingId;
    counterpartyStatus = 'existing';
  }

  const { error } = await adminClient
    .from('linked_accounts')
    .update({
      unit_counterparty_id: counterpartyId,
      unit_counterparty_status: counterpartyStatus,
      unit_counterparty_created_at: new Date().toISOString(),
    })
    .eq('id', account.id);

  if (error) throw error;

  return counterpartyId;
}

export async function updateContributionForPaymentStatus(
  adminClient: AdminClient,
  transfer: any,
  unitStatus: string,
) {
  if (!transfer.contribution_id) return;

  const contributionStatus = appStatusForUnitStatus(unitStatus);
  const contributionUpdate: Record<string, unknown> = {
    status: contributionStatus,
  };

  if (contributionStatus !== 'pending') {
    contributionUpdate.executed_at = new Date().toISOString();
  }

  const { data: contribution, error: contributionError } = await adminClient
    .from('contributions')
    .update(contributionUpdate)
    .eq('id', transfer.contribution_id)
    .eq('user_id', transfer.user_id)
    .select('id,bucket_id,amount,status')
    .maybeSingle();

  if (contributionError) throw contributionError;
  if (!contribution || contributionStatus !== 'completed') return;

  const { data: bucket, error: bucketError } = await adminClient
    .from('bill_buckets')
    .select('id,current_amount,target_amount')
    .eq('id', contribution.bucket_id)
    .eq('user_id', transfer.user_id)
    .maybeSingle();

  if (bucketError) throw bucketError;
  if (!bucket) return;

  const nextAmount = Math.min(
    Number(bucket.current_amount) + Number(contribution.amount),
    Number(bucket.target_amount),
  );

  const { error: updateBucketError } = await adminClient
    .from('bill_buckets')
    .update({
      current_amount: nextAmount,
      status: nextAmount >= Number(bucket.target_amount) ? 'ready' : 'funding',
    })
    .eq('id', bucket.id)
    .eq('user_id', transfer.user_id);

  if (updateBucketError) throw updateBucketError;
}
