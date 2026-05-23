import { plaidRequest } from "../_shared/plaid.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { requireUser } from "../_shared/supabase.ts";

type PlaidAccount = {
  account_id: string;
  mask: string | null;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string | null;
  persistent_account_id?: string | null;
  balances?: {
    available: number | null;
    current: number | null;
    iso_currency_code: string | null;
    unofficial_currency_code: string | null;
  };
};

type LinkAccount = {
  id?: string;
  name?: string | null;
  mask?: string | null;
  type?: string | null;
  subtype?: string | null;
};

type AchNumber = {
  account_id: string;
  account: string;
  routing: string;
};

type AuthGetResponse = {
  accounts: PlaidAccount[];
  numbers?: {
    ach?: AchNumber[];
  };
  item?: {
    institution_id?: string | null;
    institution_name?: string | null;
  };
};

type ExistingAccount = {
  id: string;
  account_fingerprint: string | null;
  institution_id: string | null;
  account_name: string | null;
  account_mask: string | null;
  account_type: string | null;
  account_subtype: string | null;
};

const normalize = (value?: string | null) => (value || '').trim().toLowerCase();

function fallbackFingerprint(account: {
  institutionId?: string | null;
  name?: string | null;
  mask?: string | null;
  type?: string | null;
  subtype?: string | null;
}) {
  return [
    'fallback',
    normalize(account.institutionId),
    normalize(account.name),
    normalize(account.mask),
    normalize(account.type),
    normalize(account.subtype),
  ].join(':');
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function accountFingerprint(
  account: PlaidAccount,
  institutionId: string | null,
  authAccount?: PlaidAccount,
  achNumber?: AchNumber,
) {
  const persistentAccountId = authAccount?.persistent_account_id || account.persistent_account_id;
  if (persistentAccountId) return `persistent:${persistentAccountId}`;

  if (achNumber?.account && achNumber?.routing) {
    return `ach:${await sha256(`${achNumber.routing}:${achNumber.account}`)}`;
  }

  return fallbackFingerprint({
    institutionId,
    name: account.name,
    mask: account.mask,
    type: account.type,
    subtype: account.subtype,
  });
}

async function getAuthData(accessToken: string) {
  try {
    return await plaidRequest<AuthGetResponse>('/auth/get', { access_token: accessToken });
  } catch {
    return null;
  }
}

async function removePlaidItem(accessToken: string) {
  try {
    await plaidRequest('/item/remove', { access_token: accessToken });
  } catch {
    // Duplicate cleanup should not block the user's main linking flow.
  }
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { user, adminClient } = await requireUser(req);
    const { public_token, institution, accounts: linkAccounts = [] } = await req.json();

    if (!public_token) {
      return jsonResponse({ error: 'Missing public_token' }, 400);
    }

    const institutionId = institution?.institution_id || null;
    const institutionName = institution?.name || 'Unknown Bank';

    const { data: existingRows, error: existingError } = await adminClient
      .from('linked_accounts')
      .select('id,account_fingerprint,institution_id,account_name,account_mask,account_type,account_subtype')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (existingError) throw existingError;

    const existingAccounts = (existingRows || []) as ExistingAccount[];
    const existingFallbacks = new Set(
      existingAccounts.map((account) => account.account_fingerprint || fallbackFingerprint({
        institutionId: account.institution_id,
        name: account.account_name,
        mask: account.account_mask,
        type: account.account_type,
        subtype: account.account_subtype,
      }))
    );

    const metadataAccounts = (Array.isArray(linkAccounts) ? linkAccounts : []) as LinkAccount[];
    const metadataFingerprints = metadataAccounts.map((account) => fallbackFingerprint({
      institutionId,
      name: account.name,
      mask: account.mask,
      type: account.type,
      subtype: account.subtype,
    }));

    if (
      metadataFingerprints.length > 0 &&
      metadataFingerprints.every((fingerprint) => existingFallbacks.has(fingerprint))
    ) {
      return jsonResponse({
        success: false,
        duplicate: true,
        accounts: [],
        error: 'This bank account is already connected. Refreshing the existing connection will update its balance.',
      });
    }

    const exchange = await plaidRequest<{ access_token: string; item_id: string }>(
      '/item/public_token/exchange',
      { public_token },
    );

    const [accountsResponse, authResponse] = await Promise.all([
      plaidRequest<{ accounts: PlaidAccount[] }>('/accounts/get', {
        access_token: exchange.access_token,
      }),
      getAuthData(exchange.access_token),
    ]);

    if (!accountsResponse.accounts?.length) {
      throw new Error('Plaid returned no accounts for this institution');
    }

    const authAccountsById = new Map(
      (authResponse?.accounts || []).map((account) => [account.account_id, account])
    );
    const achByAccountId = new Map(
      (authResponse?.numbers?.ach || []).map((number) => [number.account_id, number])
    );
    const resolvedInstitutionId = institutionId || authResponse?.item?.institution_id || null;
    const resolvedInstitutionName = institutionName || authResponse?.item?.institution_name || 'Unknown Bank';
    const syncedAt = new Date().toISOString();

    const existingByFingerprint = new Map<string, ExistingAccount>();
    existingAccounts.forEach((account) => {
      const fingerprint = account.account_fingerprint || fallbackFingerprint({
        institutionId: account.institution_id,
        name: account.account_name,
        mask: account.account_mask,
        type: account.account_type,
        subtype: account.account_subtype,
      });
      existingByFingerprint.set(fingerprint, account);
    });

    const { count: activeAccountCount, error: countError } = await adminClient
      .from('linked_accounts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (countError) throw countError;

    const savedAccounts = [];
    const duplicateAccounts = [];
    let newAccountCount = 0;

    for (const account of accountsResponse.accounts) {
      const authAccount = authAccountsById.get(account.account_id);
      const achNumber = achByAccountId.get(account.account_id);
      const fingerprint = await accountFingerprint(account, resolvedInstitutionId, authAccount, achNumber);
      const existingAccount = existingByFingerprint.get(fingerprint);
      const row = {
        user_id: user.id,
        plaid_item_id: exchange.item_id,
        plaid_access_token: exchange.access_token,
        plaid_account_id: account.account_id,
        institution_name: resolvedInstitutionName,
        institution_id: resolvedInstitutionId,
        account_name: account.name,
        account_official_name: account.official_name,
        account_mask: account.mask,
        account_type: account.type,
        account_subtype: account.subtype,
        balance_available: account.balances?.available ?? null,
        balance_current: account.balances?.current ?? null,
        balance_iso_currency_code: account.balances?.iso_currency_code ?? null,
        balance_unofficial_currency_code: account.balances?.unofficial_currency_code ?? null,
        balance_last_synced_at: syncedAt,
        plaid_persistent_account_id: authAccount?.persistent_account_id || null,
        account_fingerprint: fingerprint,
        is_primary: (activeAccountCount || 0) === 0 && newAccountCount === 0,
        is_active: true,
        last_synced_at: syncedAt,
      };

      if (existingAccount) {
        duplicateAccounts.push(existingAccount);
        const { data, error } = await adminClient
          .from('linked_accounts')
          .update({
            institution_name: row.institution_name,
            institution_id: row.institution_id,
            account_name: row.account_name,
            account_official_name: row.account_official_name,
            account_mask: row.account_mask,
            account_type: row.account_type,
            account_subtype: row.account_subtype,
            balance_available: row.balance_available,
            balance_current: row.balance_current,
            balance_iso_currency_code: row.balance_iso_currency_code,
            balance_unofficial_currency_code: row.balance_unofficial_currency_code,
            balance_last_synced_at: row.balance_last_synced_at,
            plaid_persistent_account_id: row.plaid_persistent_account_id,
            account_fingerprint: row.account_fingerprint,
            last_synced_at: row.last_synced_at,
          })
          .eq('id', existingAccount.id)
          .select('id, institution_name, account_name, account_mask, account_type, account_subtype, balance_current, balance_available, is_primary')
          .single();

        if (error) throw error;
        savedAccounts.push(data);
        continue;
      }

      const { data, error } = await adminClient
        .from('linked_accounts')
        .insert(row)
        .select('id, institution_name, account_name, account_mask, account_type, account_subtype, balance_current, balance_available, is_primary')
        .single();

      if (error) throw error;
      savedAccounts.push(data);
      newAccountCount += 1;
    }

    if (duplicateAccounts.length > 0 && newAccountCount === 0) {
      await removePlaidItem(exchange.access_token);
    }

    return jsonResponse({
      success: true,
      duplicate: duplicateAccounts.length > 0,
      accounts: savedAccounts,
      saved_count: newAccountCount,
      duplicate_count: duplicateAccounts.length,
      message: duplicateAccounts.length > 0
        ? 'One or more accounts were already connected, so the existing account was updated instead of duplicated.'
        : undefined,
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
});
