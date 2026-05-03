import { plaidRequest } from "../_shared/plaid.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { requireUser } from "../_shared/supabase.ts";

type StoredAccount = {
  id: string;
  plaid_item_id: string;
  plaid_access_token: string;
  plaid_account_id: string;
};

type PlaidAccount = {
  account_id: string;
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

    const { data: storedAccounts, error } = await adminClient
      .from("linked_accounts")
      .select("id,plaid_item_id,plaid_access_token,plaid_account_id")
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (error) throw error;

    const accounts = (storedAccounts || []) as StoredAccount[];
    const accessTokens = [...new Set(accounts.map((account) => account.plaid_access_token))];
    const syncedAt = new Date().toISOString();
    let updated = 0;

    for (const accessToken of accessTokens) {
      const balanceResponse = await plaidRequest<{ accounts: PlaidAccount[] }>("/accounts/balance/get", {
        access_token: accessToken,
      });

      for (const plaidAccount of balanceResponse.accounts) {
        const matchingAccount = accounts.find((account) => account.plaid_account_id === plaidAccount.account_id);
        if (!matchingAccount) continue;

        const { error: updateError } = await adminClient
          .from("linked_accounts")
          .update({
            balance_available: plaidAccount.balances?.available ?? null,
            balance_current: plaidAccount.balances?.current ?? null,
            balance_iso_currency_code: plaidAccount.balances?.iso_currency_code ?? null,
            balance_unofficial_currency_code: plaidAccount.balances?.unofficial_currency_code ?? null,
            balance_last_synced_at: syncedAt,
            last_synced_at: syncedAt,
          })
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
