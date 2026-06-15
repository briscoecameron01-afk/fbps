import { plaidRequest } from "../_shared/plaid.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { requireUser } from "../_shared/supabase.ts";

type StoredAccount = {
  id: string;
  plaid_item_id: string;
  plaid_access_token: string;
  plaid_account_id: string;
  account_fingerprint: string | null;
  institution_id: string | null;
  account_name: string | null;
  account_mask: string | null;
  account_type: string | null;
  account_subtype: string | null;
};

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

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { user, adminClient } = await requireUser(req);

    const { data: storedAccounts, error } = await adminClient
      .from("linked_accounts")
      .select("id,plaid_item_id,plaid_access_token,plaid_account_id,account_fingerprint,institution_id,account_name,account_mask,account_type,account_subtype")
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (error) throw error;

    const accounts = (storedAccounts || []) as StoredAccount[];
    const accessTokens = [...new Set(accounts.map((account) => account.plaid_access_token))];
    const syncedAt = new Date().toISOString();
    let updated = 0;

    for (const accessToken of accessTokens) {
      const accountsForToken = accounts.filter((account) => account.plaid_access_token === accessToken);
      const [balanceResponse, authResponse] = await Promise.all([
        plaidRequest<{ accounts: PlaidAccount[] }>("/accounts/balance/get", {
          access_token: accessToken,
        }),
        getAuthData(accessToken),
      ]);

      const authAccountsById = new Map(
        (authResponse?.accounts || []).map((account) => [account.account_id, account])
      );
      const achByAccountId = new Map(
        (authResponse?.numbers?.ach || []).map((number) => [number.account_id, number])
      );
      const institutionId = authResponse?.item?.institution_id || accountsForToken[0]?.institution_id || null;
      const institutionName = authResponse?.item?.institution_name || null;

      for (const plaidAccount of balanceResponse.accounts) {
        const authAccount = authAccountsById.get(plaidAccount.account_id);
        const achNumber = achByAccountId.get(plaidAccount.account_id);
        const fingerprint = await accountFingerprint(plaidAccount, institutionId, authAccount, achNumber);
        const matchingAccount =
          accountsForToken.find((account) => account.plaid_account_id === plaidAccount.account_id) ||
          accountsForToken.find((account) => account.account_fingerprint === fingerprint);

        if (!matchingAccount) continue;

        const updates: Record<string, unknown> = {
          plaid_account_id: plaidAccount.account_id,
          institution_id: institutionId,
          account_name: plaidAccount.name,
          account_official_name: plaidAccount.official_name,
          account_mask: plaidAccount.mask,
          account_type: plaidAccount.type,
          account_subtype: plaidAccount.subtype,
          balance_available: plaidAccount.balances?.available ?? null,
          balance_current: plaidAccount.balances?.current ?? null,
          balance_iso_currency_code: plaidAccount.balances?.iso_currency_code ?? null,
          balance_unofficial_currency_code: plaidAccount.balances?.unofficial_currency_code ?? null,
          balance_last_synced_at: syncedAt,
          plaid_persistent_account_id: authAccount?.persistent_account_id || null,
          account_fingerprint: fingerprint,
          last_synced_at: syncedAt,
        };

        if (institutionName) updates.institution_name = institutionName;

        const { error: updateError } = await adminClient
          .from("linked_accounts")
          .update(updates)
          .eq("id", matchingAccount.id);

        if (updateError) throw updateError;
        updated += 1;
      }
    }

    return jsonResponse({ success: true, updated });
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
});
