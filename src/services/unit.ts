import { supabase } from './supabase';

export type UnitTransferDirection = 'to_unit' | 'from_unit';

export type UnitAccount = {
  id: string;
  name: string;
  status: string;
  currency: string;
  balance: number | null;
  available: number | null;
  hold: number | null;
};

export type CreateUnitTransferInput = {
  linkedAccountId: string;
  amount: number;
  direction: UnitTransferDirection;
  billId?: string;
  description?: string;
};

function getFunctionError(error: any, data: any, fallback: string) {
  return error?.message || data?.error || fallback;
}

export async function getUnitAccount() {
  const { data, error } = await supabase.functions.invoke('unit-get-account');
  if (error || data?.error) {
    throw new Error(getFunctionError(error, data, 'Unable to load Unit account'));
  }

  return data.account as UnitAccount;
}

export async function createUnitTransfer(input: CreateUnitTransferInput) {
  const { data, error } = await supabase.functions.invoke('unit-create-transfer', {
    body: {
      linked_account_id: input.linkedAccountId,
      amount: input.amount,
      direction: input.direction,
      bill_id: input.billId || null,
      description: input.description,
    },
  });

  if (error || data?.error) {
    throw new Error(getFunctionError(error, data, 'Unable to create Unit transfer'));
  }

  return data;
}

export async function refreshUnitTransfers() {
  const { data, error } = await supabase.functions.invoke('unit-refresh-transfers');
  if (error || data?.error) {
    throw new Error(getFunctionError(error, data, 'Unable to refresh Unit transfers'));
  }

  return data;
}
