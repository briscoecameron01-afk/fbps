import {plaidRequest} from "../_shared/plaid.ts";
import {handleCors, jsonResponse} from "../_shared/cors.ts";
import {requireUser} from "../_shared/supabase.ts";

type PlaidAccount = {
  account_id: string;
  mask: string | null;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string | null;
  balances?: {
    available: number | null;
    current: number | null;
    iso_currency_code: string | null;
    unofficial_currency_code: string | null;
  };
};

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { user, adminClient } = await requireUser(req);
    const { public_token, institution } = await req.json();

    if (!public_token) {
      return jsonResponse({ error: 'Missing public_token' }, 400);
    }

    const exchange = await plaidRequest<{ access_token: string; item_id: string }>(
      '/item/public_token/exchange',
      { public_token },
    );

    const accountsResponse = await plaidRequest<{ accounts: PlaidAccount[] }>('/accounts/get', {
      access_token: exchange.access_token,
    });

    if (!accountsResponse.accounts?.length) {
      throw new Error('Plaid returned no accounts for this institution');
    }

    const rows = accountsResponse.accounts.map((account, index) => ({
      user_id: user.id,
      plaid_item_id: exchange.item_id,
      plaid_access_token: exchange.access_token,
      plaid_account_id: account.account_id,
      institution_name: institution?.name || 'Unknown Bank',
      institution_id: institution?.institution_id || null,
      account_name: account.name,
      account_official_name: account.official_name,
      account_mask: account.mask,
      account_type: account.type,
      account_subtype: account.subtype,
      balance_available: account.balances?.available ?? null,
      balance_current: account.balances?.current ?? null,
      balance_iso_currency_code: account.balances?.iso_currency_code ?? null,
      balance_unofficial_currency_code: account.balances?.unofficial_currency_code ?? null,
      balance_last_synced_at: new Date().toISOString(),
      is_primary: index === 0,
      is_active: true,
      last_synced_at: new Date().toISOString(),
    }));

    const { data: savedAccounts, error } = await adminClient
      .from('linked_accounts')
      .upsert(rows, { onConflict: 'plaid_account_id' })
      .select('id, institution_name, account_name, account_mask, account_type, account_subtype, balance_current, balance_available, is_primary');

    if (error) throw error;

    return jsonResponse({ success: true, accounts: savedAccounts || [] });
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
});
